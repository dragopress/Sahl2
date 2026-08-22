import {BadRequestException,Injectable,NotFoundException} from '@nestjs/common';
import {Prisma,PrismaClient} from '@prisma/client';
import {PrismaService} from '../common/prisma.service';
import {AuditService} from '../common/audit.service';
import {CreateWarehouseDto,StockAdjustmentDto,StockIssueDto,StockReceiptDto,StockTransferDto} from './inventory.dto';

type Tx=PrismaClient|Prisma.TransactionClient;

@Injectable()
export class InventoryService {
  constructor(private readonly prisma:PrismaService, private readonly audit:AuditService){}

  async warehouses(organizationId:string){return this.prisma.warehouse.findMany({where:{organizationId},orderBy:[{isDefault:'desc'},{name:'asc'}]});}

  async createWarehouse(organizationId:string,userId:string,dto:CreateWarehouseDto,request:any){
    const name=dto.name.trim(), code=dto.code.trim().toUpperCase();
    if(!name||!code) throw new BadRequestException('Le nom et le code du dépôt sont requis.');
    if(await this.prisma.warehouse.findFirst({where:{organizationId,code}})) throw new BadRequestException('Ce code de dépôt existe déjà.');
    const row=await this.prisma.$transaction(async tx=>{
      if(dto.isDefault) await tx.warehouse.updateMany({where:{organizationId},data:{isDefault:false}});
      const count=await tx.warehouse.count({where:{organizationId}});
      return tx.warehouse.create({data:{organizationId,name,code,isDefault:dto.isDefault??count===0}});
    });
    await this.audit.record({organizationId,userId,action:'CREATE',entity:'Warehouse',entityId:row.id,next:row,ip:request.ip,userAgent:request.headers['user-agent']});
    return row;
  }

  async ensureDefaultWarehouse(tx:Tx,organizationId:string){
    let warehouse=await tx.warehouse.findFirst({where:{organizationId,active:true,isDefault:true}});
    if(warehouse) return warehouse;
    warehouse=await tx.warehouse.findFirst({where:{organizationId,active:true},orderBy:{createdAt:'asc'}});
    if(warehouse){await tx.warehouse.update({where:{id:warehouse.id},data:{isDefault:true}});return {...warehouse,isDefault:true};}
    return tx.warehouse.create({data:{organizationId,name:'Dépôt principal',code:'MAIN',active:true,isDefault:true}});
  }

  async stock(organizationId:string,warehouseId?:string){
    const where:any={warehouse:{organizationId},product:{type:'PRODUCT',active:true}};
    if(warehouseId) where.warehouseId=warehouseId;
    const rows=await this.prisma.warehouseStock.findMany({where,include:{warehouse:true,product:{include:{category:true}}},orderBy:{product:{name:'asc'}}});
    return rows.map(r=>({...r,quantity:Number(r.quantity),minimumStock:Number(r.product.minimumStock)}));
  }

  async movements(organizationId:string,warehouseId?:string,productId?:string,type?:string){
    const rows=await this.prisma.stockMovement.findMany({where:{organizationId,...(warehouseId?{warehouseId}:{}),...(productId?{productId}:{}),...(type?{type:type as any}:{})},include:{warehouse:true,product:true},orderBy:{occurredAt:'desc'},take:250});
    return rows.map(r=>({...r,quantity:Number(r.quantity)}));
  }

  async lowStock(organizationId:string){
    const rows=await this.prisma.warehouseStock.findMany({where:{warehouse:{organizationId,active:true},product:{organizationId,type:'PRODUCT',active:true,minimumStock:{gt:0}}},include:{warehouse:true,product:true},orderBy:{product:{name:'asc'}}});
    return rows.filter(r=>Number(r.quantity)<=Number(r.product.minimumStock)).map(r=>({...r,quantity:Number(r.quantity),minimumStock:Number(r.product.minimumStock)}));
  }

  private async assertWarehouse(tx:Tx,organizationId:string,id:string){
    const w=await tx.warehouse.findFirst({where:{id,organizationId,active:true}});
    if(!w) throw new BadRequestException('Dépôt introuvable ou inactif.');
    return w;
  }

  private async assertProduct(tx:Tx,organizationId:string,id:string){
    const p=await tx.product.findFirst({where:{id,organizationId,active:true}});
    if(!p) throw new BadRequestException('Produit introuvable ou inactif.');
    if(p.type!=='PRODUCT') throw new BadRequestException('Les services ne sont pas gérés en stock.');
    return p;
  }

  private async move(tx:Tx,args:{organizationId:string;warehouseId:string;productId:string;delta:number;type:any;sourceType?:string;sourceId?:string;note?:string;occurredAt?:Date}){
    const p=await this.assertProduct(tx,args.organizationId,args.productId);
    await this.assertWarehouse(tx,args.organizationId,args.warehouseId);
    const current=await tx.warehouseStock.findUnique({where:{warehouseId_productId:{warehouseId:args.warehouseId,productId:args.productId}}});
    const currentQty=Number(current?.quantity??0), next=currentQty+args.delta;
    if(next< -0.0005) throw new BadRequestException(`Stock insuffisant pour ${p.name}. Disponible: ${currentQty}.`);
    await tx.warehouseStock.upsert({where:{warehouseId_productId:{warehouseId:args.warehouseId,productId:args.productId}},create:{warehouseId:args.warehouseId,productId:args.productId,quantity:args.delta},update:{quantity:{increment:args.delta}}});
    await tx.product.update({where:{id:p.id},data:{stock:{increment:args.delta}}});
    return tx.stockMovement.create({data:{organizationId:args.organizationId,warehouseId:args.warehouseId,productId:args.productId,quantity:Math.abs(args.delta),type:args.type,sourceType:args.sourceType,sourceId:args.sourceId,note:args.note,occurredAt:args.occurredAt??new Date()}});
  }

  async adjust(organizationId:string,userId:string,dto:StockAdjustmentDto,request:any){
    const movement=await this.prisma.$transaction(tx=>this.move(tx,{organizationId,warehouseId:dto.warehouseId,productId:dto.productId,delta:dto.direction==='IN'?dto.quantity:-dto.quantity,type:dto.direction==='IN'?'ADJUSTMENT_IN':'ADJUSTMENT_OUT',note:dto.note?.trim(),occurredAt:dto.occurredAt?new Date(dto.occurredAt):undefined}));
    await this.audit.record({organizationId,userId,action:'STOCK_ADJUST',entity:'StockMovement',entityId:movement.id,next:movement,ip:request.ip,userAgent:request.headers['user-agent']});
    return movement;
  }

  async receive(organizationId:string,userId:string,dto:StockReceiptDto,request:any){
    const movement=await this.prisma.$transaction(tx=>this.move(tx,{organizationId,warehouseId:dto.warehouseId,productId:dto.productId,delta:dto.quantity,type:'RECEIPT',sourceType:'RECEIPT',sourceId:dto.sourceId,note:dto.note?.trim(),occurredAt:dto.occurredAt?new Date(dto.occurredAt):undefined}));
    await this.audit.record({organizationId,userId,action:'STOCK_RECEIPT',entity:'StockMovement',entityId:movement.id,next:movement,ip:request.ip,userAgent:request.headers['user-agent']});
    return movement;
  }

  async issue(organizationId:string,userId:string,dto:StockIssueDto,request:any){
    const movement=await this.prisma.$transaction(tx=>this.move(tx,{organizationId,warehouseId:dto.warehouseId,productId:dto.productId,delta:-dto.quantity,type:'SALE_ISSUE',sourceType:'ISSUE',sourceId:dto.sourceId,note:dto.note?.trim(),occurredAt:dto.occurredAt?new Date(dto.occurredAt):undefined}));
    await this.audit.record({organizationId,userId,action:'STOCK_ISSUE',entity:'StockMovement',entityId:movement.id,next:movement,ip:request.ip,userAgent:request.headers['user-agent']});
    return movement;
  }

  async transfer(organizationId:string,userId:string,dto:StockTransferDto,request:any){
    if(dto.fromWarehouseId===dto.toWarehouseId) throw new BadRequestException('Les dépôts source et destination doivent être différents.');
    const result=await this.prisma.$transaction(async tx=>{
      const out=await this.move(tx,{organizationId,warehouseId:dto.fromWarehouseId,productId:dto.productId,delta:-dto.quantity,type:'TRANSFER_OUT',sourceType:'TRANSFER',note:dto.note?.trim(),occurredAt:dto.occurredAt?new Date(dto.occurredAt):undefined});
      const into=await this.move(tx,{organizationId,warehouseId:dto.toWarehouseId,productId:dto.productId,delta:dto.quantity,type:'TRANSFER_IN',sourceType:'TRANSFER',sourceId:out.id,note:dto.note?.trim(),occurredAt:dto.occurredAt?new Date(dto.occurredAt):undefined});
      return {out,into};
    });
    await this.audit.record({organizationId,userId,action:'STOCK_TRANSFER',entity:'StockMovement',entityId:result.out.id,next:result,ip:request.ip,userAgent:request.headers['user-agent']});
    return result;
  }

  async openingForProduct(tx:Tx,organizationId:string,productId:string,quantity:number,userId?:string){
    if(quantity<=0) return null;
    const warehouse=await this.ensureDefaultWarehouse(tx,organizationId);
    return this.move(tx,{organizationId,warehouseId:warehouse.id,productId,delta:quantity,type:'OPENING',sourceType:'OPENING',sourceId:productId,note:'Stock initial'});
  }

  async reverseInvoice(tx:Tx,organizationId:string,invoiceId:string){
    const invoice=await tx.invoice.findFirst({where:{id:invoiceId,organizationId},include:{items:true}});
    if(!invoice) throw new NotFoundException('Facture introuvable.');
    if(!invoice.stockPostedAt) return invoice;
    const warehouse=invoice.warehouseId?await this.assertWarehouse(tx,organizationId,invoice.warehouseId):await this.ensureDefaultWarehouse(tx,organizationId);
    const totals=new Map<string,number>();
    for(const item of invoice.items){if(!item.productId) continue;totals.set(item.productId,(totals.get(item.productId)??0)+Number(item.quantity));}
    for(const [productId,quantity] of totals){
      const existing=await tx.stockMovement.findFirst({where:{organizationId,sourceType:'SALE_CANCEL',sourceId:invoice.id,productId}});
      if(existing) continue;
      await this.move(tx,{organizationId,warehouseId:warehouse.id,productId,delta:quantity,type:'ADJUSTMENT_IN',sourceType:'SALE_CANCEL',sourceId:invoice.id,note:`Annulation facture ${invoice.number}`});
    }
    return invoice;
  }

  async postInvoice(tx:Tx,organizationId:string,invoiceId:string){
    const invoice=await tx.invoice.findFirst({where:{id:invoiceId,organizationId},include:{items:true}});
    if(!invoice) throw new NotFoundException('Facture introuvable.');
    if(invoice.stockPostedAt) return invoice;
    const warehouse=invoice.warehouseId?await this.assertWarehouse(tx,organizationId,invoice.warehouseId):await this.ensureDefaultWarehouse(tx,organizationId);
    const totals=new Map<string,number>();
    for(const item of invoice.items){if(!item.productId) continue;totals.set(item.productId,(totals.get(item.productId)??0)+Number(item.quantity));}
    for(const [productId,quantity] of totals){
      const existing=await tx.stockMovement.findFirst({where:{organizationId,sourceType:'SALE',sourceId:invoice.id,productId}});
      if(existing) continue;
      await this.move(tx,{organizationId,warehouseId:warehouse.id,productId,delta:-quantity,type:'SALE_ISSUE',sourceType:'SALE',sourceId:invoice.id,note:`Facture ${invoice.number}`});
    }
    return tx.invoice.update({where:{id:invoice.id},data:{warehouseId:warehouse.id,stockPostedAt:new Date()}});
  }
}

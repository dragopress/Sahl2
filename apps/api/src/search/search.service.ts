import {Injectable} from '@nestjs/common';
import {PrismaService} from '../common/prisma.service';
import {SearchDto} from './search.dto';

type SearchItem={id:string;type:string;title:string;subtitle?:string|null;href:string;updatedAt?:Date;score:number};

@Injectable()
export class SearchService {
 constructor(private readonly prisma:PrismaService){}
 private text(q:string){return q.trim().slice(0,100)}
 private score(title:string,q:string){const a=title.toLocaleLowerCase(),b=q.toLocaleLowerCase();if(a===b)return 100;if(a.startsWith(b))return 80;if(a.includes(b))return 60;return 20}
 async search(orgId:string,userId:string,dto:SearchDto){
  const q=this.text(dto.q), page=dto.page||1, pageSize=Math.min(dto.pageSize||30,50), skip=(page-1)*pageSize;
  const contains={contains:q,mode:'insensitive' as const};
  const [customers,products,quotes,invoices,projects,tasks,suppliers,bills,expenses,documents,warehouses]=await Promise.all([
   this.prisma.customer.findMany({where:{organizationId:orgId,OR:[{name:contains},{email:contains},{phone:contains},{ice:contains}]},select:{id:nameSelect.id,name:true,email:true,phone:true,updatedAt:true},take:100}),
   this.prisma.product.findMany({where:{organizationId:orgId,OR:[{name:contains},{sku:contains},{barcode:contains},{description:contains}]},select:{id:true,name:true,sku:true,type:true,updatedAt:true},take:100}),
   this.prisma.quote.findMany({where:{organizationId:orgId,OR:[{number:contains},{customer:{name:contains}}]},select:{id:true,number:true,status:true,total:true,updatedAt:true,customer:{select:{name:true}}},take:100}),
   this.prisma.invoice.findMany({where:{organizationId:orgId,OR:[{number:contains},{customer:{name:contains}}]},select:{id:true,number:true,status:true,total:true,dueAt:true,updatedAt:true,customer:{select:{name:true}}},take:100}),
   this.prisma.project.findMany({where:{organizationId:orgId,OR:[{name:contains},{status:contains}]},select:{id:true,name:true,status:true,updatedAt:true},take:100}),
   this.prisma.task.findMany({where:{organizationId:orgId,OR:[{title:contains},{status:contains}]},select:{id:true,title:true,status:true,dueAt:true,updatedAt:true},take:100}),
   this.prisma.supplier.findMany({where:{organizationId:orgId,OR:[{name:contains},{email:contains},{phone:contains},{ice:contains},{ifNumber:contains},{rc:contains}]},select:{id:true,name:true,email:true,phone:true,updatedAt:true},take:100}),
   this.prisma.supplierBill.findMany({where:{organizationId:orgId,OR:[{number:contains},{externalNumber:contains},{supplier:{name:contains}}]},select:{id:true,number:true,externalNumber:true,status:true,total:true,dueAt:true,updatedAt:true,supplier:{select:{name:true}}},take:100}),
   this.prisma.expense.findMany({where:{organizationId:orgId,OR:[{description:contains},{category:contains}]},select:{id:true,category:true,description:true,amount:true,status:true,incurredAt:true,updatedAt:true},take:100}),
   this.prisma.document.findMany({where:{organizationId:orgId,OR:[{name:contains},{entityType:contains},{entityId:contains}],AND:[{OR:[{visibility:'ORGANIZATION'},{createdById:userId},{permissions:{some:{userId}}}]}]},select:{id:true,name:true,category:true,entityType:true,entityId:true,updatedAt:true},take:100}),
   this.prisma.warehouse.findMany({where:{organizationId:orgId,OR:[{name:contains},{code:contains}]},select:{id:true,name:true,code:true,updatedAt:true},take:50}),
  ]);
  const items:SearchItem[]=[];
  customers.forEach(x=>items.push({id:x.id,type:'customer',title:x.name,subtitle:x.email||x.phone||'Client',href:'/customers',updatedAt:x.updatedAt,score:this.score(x.name,q)}));
  products.forEach(x=>items.push({id:x.id,type:x.type==='SERVICE'?'service':'product',title:x.name,subtitle:x.sku||x.type,href:'/products',updatedAt:x.updatedAt,score:this.score(x.name,q)}));
  quotes.forEach(x=>items.push({id:x.id,type:'quote',title:x.number,subtitle:`${x.customer.name} · ${x.status} · ${x.total} MAD`,href:'/quotes',updatedAt:x.updatedAt,score:this.score(x.number,q)}));
  invoices.forEach(x=>items.push({id:x.id,type:'invoice',title:x.number,subtitle:`${x.customer.name} · ${x.status} · ${x.total} MAD`,href:'/invoices',updatedAt:x.updatedAt,score:this.score(x.number,q)}));
  projects.forEach(x=>items.push({id:x.id,type:'project',title:x.name,subtitle:x.status,href:'/projects',updatedAt:x.updatedAt,score:this.score(x.name,q)}));
  tasks.forEach(x=>items.push({id:x.id,type:'task',title:x.title,subtitle:x.status+(x.dueAt?` · ${new Date(x.dueAt).toLocaleDateString('fr-FR')}`:''),href:'/tasks',updatedAt:x.updatedAt,score:this.score(x.title,q)}));
  suppliers.forEach(x=>items.push({id:x.id,type:'supplier',title:x.name,subtitle:x.email||x.phone||'Fournisseur',href:'/suppliers',updatedAt:x.updatedAt,score:this.score(x.name,q)}));
  bills.forEach(x=>items.push({id:x.id,type:'supplier_bill',title:x.number,subtitle:`${x.supplier.name} · ${x.status} · ${x.total} MAD`,href:'/suppliers',updatedAt:x.updatedAt,score:this.score(x.number,q)}));
  expenses.forEach(x=>items.push({id:x.id,type:'expense',title:x.description||x.category,subtitle:`${x.status} · ${x.amount} MAD`,href:'/expenses',updatedAt:x.updatedAt,score:this.score(x.description||x.category,q)}));
  documents.forEach(x=>items.push({id:x.id,type:'document',title:x.name,subtitle:x.category+(x.entityType?` · ${x.entityType}`:''),href:'/documents',updatedAt:x.updatedAt,score:this.score(x.name,q)}));
  warehouses.forEach(x=>items.push({id:x.id,type:'warehouse',title:x.name,subtitle:x.code,href:'/inventory',updatedAt:x.updatedAt,score:this.score(x.name,q)}));
  items.sort((a,b)=>b.score-a.score||((b.updatedAt?.getTime()||0)-(a.updatedAt?.getTime()||0)));
  const total=items.length;return {query:q,items:items.slice(skip,skip+pageSize),page,pageSize,total};
 }
}
const nameSelect={id:true} as const;

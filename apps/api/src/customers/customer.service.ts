import {BadRequestException,Injectable,NotFoundException} from '@nestjs/common';
import {PrismaService} from '../common/prisma.service';
import {AuditService} from '../common/audit.service';
import {CreateCustomerDto} from './create-customer.dto';
@Injectable()
export class CustomerService{
 constructor(private readonly prisma:PrismaService,private readonly audit:AuditService){}
 async list(organizationId:string,page=1,pageSize=25,search?:string){
  page=Math.max(1,page); pageSize=Math.min(100,Math.max(1,pageSize));
  const where={organizationId,...(search?{OR:[{name:{contains:search,mode:'insensitive' as const}},{email:{contains:search,mode:'insensitive' as const}},{phone:{contains:search,mode:'insensitive' as const}}]}:{})};
  const [data,total]=await this.prisma.$transaction([this.prisma.customer.findMany({where,orderBy:{createdAt:'desc'},skip:(page-1)*pageSize,take:pageSize}),this.prisma.customer.count({where})]);
  return {data,meta:{total,page,pageSize,pages:Math.ceil(total/pageSize)}};
 }
 async get(organizationId:string,id:string){const customer=await this.prisma.customer.findFirst({where:{id,organizationId}});if(!customer)throw new NotFoundException('Customer not found');return customer}
 async creditBalances(organizationId:string){
  const invoices=await this.prisma.invoice.findMany({where:{organizationId,status:{not:'CANCELLED'}},include:{customer:true,payments:true},orderBy:{issuedAt:'desc'}});
  const byCustomer=new Map<string,{customerId:string;customer:string;invoiced:number;paid:number;balance:number;overdue:number}>();
  for(const invoice of invoices){const paid=invoice.payments.reduce((s,p)=>s+Number(p.amount),0);const total=Number(invoice.total);const balance=Math.max(0,total-paid);if(balance<=0)continue;const key=invoice.customerId;const row=byCustomer.get(key)||{customerId:key,customer:invoice.customer.name,invoiced:0,paid:0,balance:0,overdue:0};row.invoiced+=total;row.paid+=paid;row.balance+=balance;if(invoice.dueAt&&invoice.dueAt<new Date())row.overdue+=balance;byCustomer.set(key,row)}
  return [...byCustomer.values()].map(x=>({...x,invoiced:Number(x.invoiced.toFixed(2)),paid:Number(x.paid.toFixed(2)),balance:Number(x.balance.toFixed(2)),overdue:Number(x.overdue.toFixed(2))})).sort((a,b)=>b.balance-a.balance);
 }

 async create(organizationId:string,userId:string,dto:CreateCustomerDto,request:any){
  const name=dto.name.trim(); if(!name)throw new BadRequestException('Customer name is required');
  const customer=await this.prisma.customer.create({data:{organizationId,type:dto.type??'COMPANY',name,email:dto.email?.trim().toLowerCase(),phone:dto.phone?.trim(),ice:dto.ice?.trim()}});
  await this.audit.record({organizationId,userId,action:'CREATE',entity:'Customer',entityId:customer.id,next:customer,ip:request.ip,userAgent:request.headers['user-agent']});
  return customer;
 }
 async update(organizationId:string,userId:string,id:string,dto:CreateCustomerDto,request:any){
  const previous=await this.get(organizationId,id);
  const customer=await this.prisma.customer.update({where:{id},data:{type:dto.type??previous.type,name:dto.name.trim(),email:dto.email?.trim().toLowerCase(),phone:dto.phone?.trim(),ice:dto.ice?.trim()}});
  await this.audit.record({organizationId,userId,action:'UPDATE',entity:'Customer',entityId:id,previous,next:customer,ip:request.ip,userAgent:request.headers['user-agent']});
  return customer;
 }
 async remove(organizationId:string,userId:string,id:string,request:any){
  const previous=await this.get(organizationId,id);
  await this.prisma.customer.delete({where:{id}});
  await this.audit.record({organizationId,userId,action:'DELETE',entity:'Customer',entityId:id,previous,ip:request.ip,userAgent:request.headers['user-agent']});
  return {ok:true};
 }
}

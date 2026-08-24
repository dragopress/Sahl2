import {Injectable,NotFoundException} from '@nestjs/common';
import {PrismaService} from '../common/prisma.service';

@Injectable()
export class Customer360Service{
 constructor(private readonly prisma:PrismaService){}

 async get(organizationId:string,id:string){
  const customer=await this.prisma.customer.findFirst({where:{id,organizationId}});
  if(!customer) throw new NotFoundException('Customer not found');

  const [quotes,invoices,payments]=await this.prisma.$transaction([
   this.prisma.quote.findMany({where:{organizationId,customerId:id},include:{items:{include:{product:true}}},orderBy:{createdAt:'desc'}}),
   this.prisma.invoice.findMany({where:{organizationId,customerId:id},include:{items:{include:{product:true}},payments:true},orderBy:{createdAt:'desc'}}),
   this.prisma.payment.findMany({where:{organizationId,invoice:{customerId:id}},orderBy:{paidAt:'desc'}}),
  ]);

  const invoiceTotals=invoices.reduce((acc,invoice)=>{
   const total=Number(invoice.total);
   const paid=invoice.payments.reduce((sum,payment)=>sum+Number(payment.amount),0);
   acc.invoiced+=total;
   acc.paid+=paid;
   acc.outstanding+=Math.max(0,total-paid);
   return acc;
  },{invoiced:0,paid:0,outstanding:0});

  const overdue=invoices.filter(invoice=>
   invoice.status!=='PAID' && invoice.status!=='CANCELLED' && invoice.dueAt && new Date(invoice.dueAt)<new Date()
  ).reduce((sum,invoice)=>sum+Math.max(0,Number(invoice.total)-invoice.payments.reduce((s,p)=>s+Number(p.amount),0)),0);

  return {
   customer,
   summary:{
    quoteCount:quotes.length,
    invoiceCount:invoices.length,
    paymentCount:payments.length,
    invoiced:this.money(invoiceTotals.invoiced),
    paid:this.money(invoiceTotals.paid),
    outstanding:this.money(invoiceTotals.outstanding),
    overdue:this.money(overdue),
   },
   quotes,
   invoices,
   payments,
  };
 }

 private money(value:number){return Math.round((value+Number.EPSILON)*100)/100}
}

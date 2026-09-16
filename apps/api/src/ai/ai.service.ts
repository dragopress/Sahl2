import {BadRequestException,Injectable,NotFoundException} from '@nestjs/common';
import {PrismaService} from '../common/prisma.service';

const n=(v:any)=>Number(v??0);
const money=(v:number)=>Math.round(v*100)/100;

@Injectable()
export class AiService {
 constructor(private readonly db:PrismaService){}

 async context(o:string){
  const [invoices,expenses,tasks,products,projects,cash]=await Promise.all([
   this.db.invoice.findMany({where:{organizationId:o,status:{not:'CANCELLED'}},select:{total:true,status:true,dueAt:true}}),
   this.db.expense.findMany({where:{organizationId:o,status:{in:['APPROVED','PAID']}},select:{amount:true,status:true,incurredAt:true}}),
   this.db.task.findMany({where:{organizationId:o},select:{status:true,dueAt:true}}),
   this.db.product.findMany({where:{organizationId:o,active:true},select:{name:true,stock:true,minimumStock:true}}),
   this.db.project.findMany({where:{organizationId:o},select:{name:true,budget:true,invoices:{where:{status:{not:'CANCELLED'}},select:{total:true}},expenses:{where:{status:{in:['APPROVED','PAID']}},select:{amount:true}}}}),
   this.db.cashAccount.findMany({where:{organizationId:o,active:true},select:{openingBalance:true,transactions:{select:{type:true,amount:true}}}})
  ]);
  const receivables=invoices.filter(i=>i.status!=='PAID').reduce((a,i)=>a+n(i.total),0);
  const overdue=invoices.filter(i=>i.status==='OVERDUE').reduce((a,i)=>a+n(i.total),0);
  const expenseTotal=expenses.reduce((a,e)=>a+n(e.amount),0);
  const openTasks=tasks.filter(t=>t.status!=='DONE').length;
  const overdueTasks=tasks.filter(t=>t.status!=='DONE'&&t.dueAt&&new Date(t.dueAt)<new Date()).length;
  const lowStock=products.filter(p=>n(p.stock)<=n(p.minimumStock)).length;
  const cashBalance=cash.reduce((a,c)=>a+n(c.openingBalance)+c.transactions.reduce((b,t)=>b+(['INCOME','TRANSFER_IN'].includes(t.type)?n(t.amount):-n(t.amount)),0),0);
  const projectMargins=projects.map(p=>{const r=p.invoices.reduce((a,i)=>a+n(i.total),0);const c=p.expenses.reduce((a,e)=>a+n(e.amount),0);return{budget:n(p.budget),revenue:r,cost:c,margin:r-c}});
  return {currency:'MAD',receivables:money(receivables),overdueReceivables:money(overdue),expenseTotal:money(expenseTotal),cashBalance:money(cashBalance),openTasks,overdueTasks,lowStockProducts:lowStock,projects:projectMargins};
 }

 async insights(o:string,userId:string|undefined,limit=8){
  const c=await this.context(o); const now=new Date(); const out:any[]=[];
  if(c.overdueReceivables>0) out.push({type:'cash',priority:'high',title:'Encaissements en retard',message:`${c.overdueReceivables.toLocaleString('fr-MA')} MAD de factures sont en retard. Priorisez les relances clients.`,entityType:'invoices',entityId:null});
  if(c.cashBalance<0) out.push({type:'cash',priority:'critical',title:'Trésorerie négative',message:`La trésorerie calculée est de ${c.cashBalance.toLocaleString('fr-MA')} MAD. Vérifiez les sorties prévues et les encaissements attendus.`,entityType:'cashflow',entityId:null});
  if(c.lowStockProducts>0) out.push({type:'inventory',priority:'medium',title:'Stock à surveiller',message:`${c.lowStockProducts} produit(s) sont au niveau minimum ou en dessous.`,entityType:'inventory',entityId:null});
  if(c.overdueTasks>0) out.push({type:'operations',priority:'medium',title:'Tâches en retard',message:`${c.overdueTasks} tâche(s) ont dépassé leur échéance.`,entityType:'tasks',entityId:null});
  if(c.receivables>c.expenseTotal && c.receivables>0) out.push({type:'finance',priority:'low',title:"Potentiel d'encaissement",message:`Les créances ouvertes (${c.receivables.toLocaleString('fr-MA')} MAD) dépassent les dépenses suivies (${c.expenseTotal.toLocaleString('fr-MA')} MAD). Les relances peuvent améliorer rapidement la liquidité.`,entityType:'reports',entityId:null});
  for(const p of c.projects){if(p.budget>0&&p.cost>p.budget) out.push({type:'project',priority:'high',title:'Budget projet dépassé',message:`Un projet dépasse son budget de ${money(p.cost-p.budget).toLocaleString('fr-MA')} MAD.`,entityType:'projects',entityId:null});}
  if(!out.length) out.push({type:'general',priority:'low',title:'Aucune alerte critique',message:'Les indicateurs disponibles ne montrent pas de risque majeur. Continuez à suivre la trésorerie, les créances et les échéances.',entityType:'reports',entityId:null});
  const selected=out.slice(0,limit);
  if(userId){
   const recent=await this.db.aiInsight.findMany({where:{organizationId:o,userId,createdAt:{gte:new Date(Date.now()-24*60*60*1000)},dismissedAt:null},select:{title:true}});
   const seen=new Set(recent.map(x=>x.title));
   const fresh=selected.filter(x=>!seen.has(x.title));
   if(fresh.length){
    await this.db.aiInsight.createMany({data:fresh.map(x=>({organizationId:o,userId,type:x.type,priority:x.priority,title:x.title,message:x.message,entityType:x.entityType,entityId:x.entityId,source:'rules'}))});
   }
  }
  return {generatedAt:now,currency:'MAD',mode:'rules',insights:selected};
 }

 async dismiss(o:string,id:string){
  if(!id) throw new BadRequestException('Insight id required');
  const insight=await this.db.aiInsight.findFirst({where:{id,organizationId:o}});
  if(!insight) throw new NotFoundException('Insight not found');
  return this.db.aiInsight.update({where:{id},data:{dismissedAt:new Date()}});
 }

 async ask(o:string,question:string){
  const q=question.trim().toLowerCase(); if(q.length<3) throw new BadRequestException('Question is required');
  const c=await this.context(o);
  if(q.includes('trésor')||q.includes('cash')||q.includes('liquid')) return {mode:'rules',answer:`La trésorerie calculée est de ${c.cashBalance.toLocaleString('fr-MA')} MAD. Les créances ouvertes sont de ${c.receivables.toLocaleString('fr-MA')} MAD et les créances en retard de ${c.overdueReceivables.toLocaleString('fr-MA')} MAD.`};
  if(q.includes('factur')||q.includes('client')||q.includes('impay')) return {mode:'rules',answer:`Les créances ouvertes s'élèvent à ${c.receivables.toLocaleString('fr-MA')} MAD, dont ${c.overdueReceivables.toLocaleString('fr-MA')} MAD en retard.`};
  if(q.includes('stock')) return {mode:'rules',answer:`${c.lowStockProducts} produit(s) sont actuellement au niveau minimum ou en dessous.`};
  if(q.includes('tâch')||q.includes('retard')) return {mode:'rules',answer:`${c.openTasks} tâche(s) sont ouvertes, dont ${c.overdueTasks} en retard.`};
  return {mode:'rules',answer:'Je peux analyser la trésorerie, les impayés, les stocks et les tâches à partir des données de votre organisation. Pour une question plus précise, utilisez un terme comme « trésorerie », « impayés », « stock » ou « tâches ».',context:c};
 }
}

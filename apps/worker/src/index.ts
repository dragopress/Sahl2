import {Queue,Worker} from 'bullmq';
import IORedis from 'ioredis';
import {PrismaClient} from '@prisma/client';
const connection=new IORedis(process.env.REDIS_URL||'redis://localhost:6379',{maxRetriesPerRequest:null});
export const jobs=new Queue('sahlbiz',{connection});
const db=new PrismaClient();
const money=(n:any)=>Number(n||0);
async function notify(orgId:string,type:any,title:string,message:string,entityType?:string,entityId?:string){const memberships=await db.membership.findMany({where:{organizationId:orgId},select:{userId:true}});for(const m of memberships){const existing=await db.notification.findFirst({where:{organizationId:orgId,userId:m.userId,type,entityId,readAt:null,createdAt:{gte:new Date(Date.now()-86400000)}}});if(!existing)await db.notification.create({data:{organizationId:orgId,userId:m.userId,type,title,message,entityType,entityId}});}}
async function runAutomation(){const orgs=await db.organization.findMany({select:{id:true}});const now=new Date();const horizon=new Date(now.getTime()+48*3600000);for(const o of orgs){
 let rules=await db.automationRule.findMany({where:{organizationId:o.id,enabled:true}});if(!rules.length){for(const [name,type] of [['Factures en retard','OVERDUE_INVOICES'],['Stock faible','LOW_STOCK'],['Échéances tâches','TASK_DEADLINES'],['Dépenses à approuver','EXPENSE_APPROVAL']] as const){await db.automationRule.upsert({where:{organizationId_name:{organizationId:o.id,name}},update:{enabled:true},create:{organizationId:o.id,name,type,enabled:true,config:{}}});}rules=await db.automationRule.findMany({where:{organizationId:o.id,enabled:true}});}
 for(const r of rules){
  if(r.type==='OVERDUE_INVOICES'){const invoices=await db.invoice.findMany({where:{organizationId:o.id,status:{in:{SENT:'SENT',PARTIALLY_PAID:'PARTIALLY_PAID',OVERDUE:'OVERDUE'}},dueAt:{lt:now}},select:{id:true,number:true,dueAt:true,customer:{select:{name:true}},total:true}});for(const i of invoices)await notify(o.id,'OVERDUE_INVOICE','Facture en retard',`${i.number} — ${i.customer.name} — échéance dépassée.`, 'Invoice',i.id);}
  if(r.type==='LOW_STOCK'){const products=await db.product.findMany({where:{organizationId:o.id,active:true},select:{id:true,name:true,stock:true,minimumStock:true}});for(const p of products)if(money(p.stock)<=money(p.minimumStock))await notify(o.id,'LOW_STOCK','Stock faible',`${p.name} est à ${p.stock}, seuil ${p.minimumStock}.`,'Product',p.id);}
  if(r.type==='TASK_DEADLINES'){const tasks=await db.task.findMany({where:{organizationId:o.id,status:{not:'DONE'},dueAt:{not:null,lte:horizon}},select:{id:true,title:true,dueAt:true,assigneeId:true}});for(const t of tasks)await notify(o.id,'TASK_DUE','Tâche à échéance',`${t.title} arrive à échéance le ${t.dueAt!.toLocaleDateString('fr-FR')}.`,'Task',t.id);}
  if(r.type==='EXPENSE_APPROVAL'){const expenses=await db.expense.findMany({where:{organizationId:o.id,status:'SUBMITTED'},select:{id:true,category:true,amount:true}});for(const e of expenses)await notify(o.id,'EXPENSE_APPROVAL','Dépense à approuver',`${e.category} — ${e.amount} MAD attend une approbation.`,'Expense',e.id);}
  await db.automationRule.update({where:{id:r.id},data:{lastRunAt:now}});
 }
}}
new Worker('sahlbiz',async job=>{if(job.name==='automation.scan')await runAutomation();console.log(`processed ${job.name}`)},{connection});
(async()=>{await jobs.upsertJobScheduler('automation-scan',{every:15*60*1000},{name:'automation.scan',data:{}});console.log('SahlBiz worker ready')})();
process.on('SIGTERM',async()=>{await db.$disconnect();await connection.quit();});

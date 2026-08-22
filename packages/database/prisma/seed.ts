import {PrismaClient} from '@prisma/client';
const db=new PrismaClient();
async function main(){const org=await db.organization.upsert({where:{slug:'demo'},update:{},create:{name:'SahlBiz Demo',slug:'demo',ice:'001234567890123'}});console.log(`seeded ${org.name}`)}
main().finally(()=>db.$disconnect());

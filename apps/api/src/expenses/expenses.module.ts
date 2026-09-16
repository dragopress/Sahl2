import {Module} from '@nestjs/common';
import {ExpensesController} from './expenses.controller';
import {ExpensesService} from './expenses.service';
import {PrismaService} from '../common/prisma.service';
import {AuditService} from '../common/audit.service';

@Module({
  controllers:[ExpensesController],
  providers:[ExpensesService,PrismaService,AuditService],
})
export class ExpensesModule{}

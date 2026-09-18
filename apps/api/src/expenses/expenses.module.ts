import {Module} from '@nestjs/common';
import {ExpensesController} from './expenses.controller';
import {ExpensesService} from './expenses.service';
import {PrismaService} from '../common/prisma.service';
import {AuditService} from '../common/audit.service';
import {AuthModule} from '../auth/auth.module';

@Module({imports:[AuthModule],controllers:[ExpensesController],providers:[ExpensesService,PrismaService,AuditService]})
export class ExpensesModule {}

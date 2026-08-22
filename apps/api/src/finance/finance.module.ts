import {Module} from '@nestjs/common';
import {FinanceController} from './finance.controller';
import {ReconciliationController} from './reconciliation.controller';
import {ReconciliationService} from './reconciliation.service';
import {FinanceService} from './finance.service';
import {PrismaService} from '../common/prisma.service';
import {AuditService} from '../common/audit.service';
@Module({controllers:[FinanceController,ReconciliationController],providers:[FinanceService,ReconciliationService,PrismaService,AuditService]}) export class FinanceModule{}

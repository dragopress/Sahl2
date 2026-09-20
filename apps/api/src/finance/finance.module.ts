import {Module} from '@nestjs/common';
import {FinanceController} from './finance.controller';
import {ReconciliationController} from './reconciliation.controller';
import {ReconciliationService} from './reconciliation.service';
import {FinanceService} from './finance.service';
import {AuthModule} from '../auth/auth.module';
import {CommonModule} from '../common/common.module';

@Module({imports:[AuthModule,CommonModule],controllers:[FinanceController,ReconciliationController],providers:[FinanceService,ReconciliationService]})
export class FinanceModule{}

import {Module} from '@nestjs/common';
import {ExpensesController} from './expenses.controller';
import {ExpensesService} from './expenses.service';
import {AuthModule} from '../auth/auth.module';
import {CommonModule} from '../common/common.module';

@Module({imports:[AuthModule,CommonModule],controllers:[ExpensesController],providers:[ExpensesService]})
export class ExpensesModule {}

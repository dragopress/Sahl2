import {Module} from '@nestjs/common';
import {SuppliersController} from './suppliers.controller';
import {SuppliersService} from './suppliers.service';
import {AuthModule} from '../auth/auth.module';
import {CommonModule} from '../common/common.module';

@Module({imports:[AuthModule,CommonModule],controllers:[SuppliersController],providers:[SuppliersService]})
export class SuppliersModule {}

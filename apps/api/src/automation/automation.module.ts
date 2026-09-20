import {Module} from '@nestjs/common';
import {AutomationController} from './automation.controller';
import {AutomationService} from './automation.service';
import {AuthModule} from '../auth/auth.module';
import {CommonModule} from '../common/common.module';

@Module({imports:[AuthModule,CommonModule],controllers:[AutomationController],providers:[AutomationService],exports:[AutomationService]})
export class AutomationModule {}

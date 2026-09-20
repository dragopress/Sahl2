import {Module} from '@nestjs/common';
import {AiController} from './ai.controller';
import {AiService} from './ai.service';
import {AuthModule} from '../auth/auth.module';
import {CommonModule} from '../common/common.module';

@Module({imports:[AuthModule,CommonModule],controllers:[AiController],providers:[AiService],exports:[AiService]})
export class AiModule{}

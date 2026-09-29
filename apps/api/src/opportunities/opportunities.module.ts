import {Module} from '@nestjs/common';
import {CommonModule} from '../common/common.module';
import {AuthModule} from '../auth/auth.module';
import {OpportunitiesController} from './opportunities.controller';
import {OpportunitiesService} from './opportunities.service';

@Module({imports:[CommonModule,AuthModule],controllers:[OpportunitiesController],providers:[OpportunitiesService],exports:[OpportunitiesService]})
export class OpportunitiesModule{}

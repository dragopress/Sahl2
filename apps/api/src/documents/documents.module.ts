import {Module} from '@nestjs/common';
import {DocumentsController} from './documents.controller';
import {DocumentsService} from './documents.service';
import {AuthModule} from '../auth/auth.module';
import {CommonModule} from '../common/common.module';

@Module({imports:[AuthModule,CommonModule],controllers:[DocumentsController],providers:[DocumentsService]})
export class DocumentsModule{}

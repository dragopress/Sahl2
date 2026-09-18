import {Module} from '@nestjs/common';
import {DocumentsController} from './documents.controller';
import {DocumentsService} from './documents.service';
import {PrismaService} from '../common/prisma.service';
import {AuditService} from '../common/audit.service';

@Module({
  controllers:[DocumentsController],
  providers:[DocumentsService,PrismaService,AuditService],
})
export class DocumentsModule{}

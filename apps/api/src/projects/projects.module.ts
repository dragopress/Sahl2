import {Module} from '@nestjs/common';
import {ProjectsController} from './projects.controller';
import {ProjectsService} from './projects.service';
import {PrismaService} from '../common/prisma.service';
import {AuditService} from '../common/audit.service';
import {AuthModule} from '../auth/auth.module';

@Module({imports:[AuthModule],controllers:[ProjectsController],providers:[ProjectsService,PrismaService,AuditService]})
export class ProjectsModule{}

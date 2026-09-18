import {Module} from '@nestjs/common';
import {AutomationController} from './automation.controller';
import {AutomationService} from './automation.service';
import {PrismaService} from '../common/prisma.service';
import {AuditService} from '../common/audit.service';
import {AuthModule} from '../auth/auth.module';

@Module({imports:[AuthModule],controllers:[AutomationController],providers:[AutomationService,PrismaService,AuditService],exports:[AutomationService]})
export class AutomationModule {}

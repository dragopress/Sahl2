import {Body,Controller,Get,Param,Patch,Post,Req,UseGuards} from '@nestjs/common';
import {AutomationService} from './automation.service';
import {AuthGuard} from '../common/auth.guard';import {TenantContextGuard} from '../common/tenant-context.guard';import {RbacGuard,RequirePermission} from '../common/rbac';import {CreateAutomationRuleDto} from './automation.dto';
@Controller('automation') @UseGuards(AuthGuard,TenantContextGuard,RbacGuard) export class AutomationController {constructor(private readonly a:AutomationService){}
 @Get('notifications') @RequirePermission('notifications:read') notifications(@Req()r:any){return this.a.notifications(r.organizationId,r.auth.userId)}
 @Get('notifications/unread') @RequirePermission('notifications:read') unread(@Req()r:any){return this.a.unread(r.organizationId,r.auth.userId)}
 @Post('notifications/read-all') @RequirePermission('notifications:write') readAll(@Req()r:any){return this.a.readAll(r.organizationId,r.auth.userId)}
 @Post('notifications/:id/read') @RequirePermission('notifications:write') read(@Req()r:any,@Param('id')id:string){return this.a.read(r.organizationId,r.auth.userId,id)}
 @Get('rules') @RequirePermission('automation:read') rules(@Req()r:any){return this.a.rules(r.organizationId)}
 @Post('rules') @RequirePermission('automation:write') create(@Req()r:any,@Body()d:CreateAutomationRuleDto){return this.a.createRule(r.organizationId,r.auth.userId,d,r)}
 @Patch('rules/:id') @RequirePermission('automation:write') update(@Req()r:any,@Param('id')id:string,@Body()d:Partial<CreateAutomationRuleDto>){return this.a.updateRule(r.organizationId,r.auth.userId,id,d,r)}
}

import {Controller,Get,Query,Req,UseGuards} from '@nestjs/common';
import {AnalyticsService} from './analytics.service';
import {AuthGuard} from '../common/auth.guard';
import {TenantContextGuard} from '../common/tenant-context.guard';
import {RbacGuard,RequirePermission} from '../common/rbac';
@Controller('analytics') @UseGuards(AuthGuard,TenantContextGuard,RbacGuard)
export class AnalyticsController {constructor(private readonly a:AnalyticsService){}
 @Get('executive') @RequirePermission('analytics:read') executive(@Req()r:any,@Query('from')f?:string,@Query('to')t?:string){return this.a.executive(r.organizationId,f,t)}
 @Get('sales') @RequirePermission('analytics:read') sales(@Req()r:any,@Query('from')f?:string,@Query('to')t?:string){return this.a.sales(r.organizationId,f,t)}
 @Get('finance') @RequirePermission('analytics:read') finance(@Req()r:any,@Query('from')f?:string,@Query('to')t?:string){return this.a.finance(r.organizationId,f,t)}
 @Get('operations') @RequirePermission('analytics:read') operations(@Req()r:any,@Query('from')f?:string,@Query('to')t?:string){return this.a.operations(r.organizationId,f,t)}
}

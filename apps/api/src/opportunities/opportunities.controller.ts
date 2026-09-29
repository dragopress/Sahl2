import {Body,Controller,Delete,Get,Param,Patch,Post,Req,UseGuards} from '@nestjs/common';
import {AuthGuard} from '../common/auth.guard';
import {TenantContextGuard} from '../common/tenant-context.guard';
import {RequirePermission,RbacGuard} from '../common/rbac';
import {CreateOpportunityDto} from './opportunities.dto';
import {OpportunitiesService} from './opportunities.service';

@Controller('opportunities')
@UseGuards(AuthGuard,TenantContextGuard,RbacGuard)
export class OpportunitiesController {
  constructor(private readonly service:OpportunitiesService){}
  @Get() @RequirePermission('opportunities:read') list(@Req()r:any){return this.service.list(r.organizationId)}
  @Post() @RequirePermission('opportunities:write') create(@Req()r:any,@Body()d:CreateOpportunityDto){return this.service.create(r.organizationId,r.auth.userId,d,r)}
  @Patch(':id') @RequirePermission('opportunities:write') update(@Req()r:any,@Param('id')id:string,@Body()d:CreateOpportunityDto){return this.service.update(r.organizationId,r.auth.userId,id,d,r)}
  @Delete(':id') @RequirePermission('opportunities:write') remove(@Req()r:any,@Param('id')id:string){return this.service.remove(r.organizationId,r.auth.userId,id,r)}
}
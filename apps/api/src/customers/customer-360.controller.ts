import {Controller,Get,Param,UseGuards} from '@nestjs/common';
import {AuthGuard} from '../common/auth.guard';
import {TenantContextGuard} from '../common/tenant-context.guard';
import {Tenant} from '../common/tenant.decorator';
import {RequirePermission,RbacGuard} from '../common/rbac';
import {Customer360Service} from './customer-360.service';

@Controller('customers')
@UseGuards(AuthGuard,TenantContextGuard,RbacGuard)
export class Customer360Controller{
 constructor(private readonly service:Customer360Service){}

 @Get(':id/360')
 @RequirePermission('customers:read')
 get(@Tenant() membership:any,@Param('id') id:string){
  return this.service.get(membership.organizationId,id);
 }
}

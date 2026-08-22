import {Body,Controller,Delete,Get,Param,Patch,Post,Query,Req,UseGuards} from '@nestjs/common';
import {AuthGuard} from '../common/auth.guard';
import {TenantContextGuard} from '../common/tenant-context.guard';
import {Tenant} from '../common/tenant.decorator';
import {RequirePermission,RbacGuard} from '../common/rbac';
import {CreateCustomerDto} from './create-customer.dto';
import {CustomerService} from './customer.service';
@Controller('customers')
@UseGuards(AuthGuard,TenantContextGuard,RbacGuard)
export class CustomersController{
 constructor(private readonly service:CustomerService){}
 @Get() @RequirePermission('customers:read') list(@Tenant() membership:any,@Query('page') page?:string,@Query('pageSize') pageSize?:string,@Query('search') search?:string){return this.service.list(membership.organizationId,Number(page)||1,Number(pageSize)||25,search)}
 @Get(':id') @RequirePermission('customers:read') get(@Tenant() membership:any,@Param('id') id:string){return this.service.get(membership.organizationId,id)}
 @Post() @RequirePermission('customers:write') create(@Tenant() membership:any,@Body() dto:CreateCustomerDto,@Req() req:any){return this.service.create(membership.organizationId,req.auth.userId,dto,req)}
 @Patch(':id') @RequirePermission('customers:write') update(@Tenant() membership:any,@Param('id') id:string,@Body() dto:CreateCustomerDto,@Req() req:any){return this.service.update(membership.organizationId,req.auth.userId,id,dto,req)}
 @Delete(':id') @RequirePermission('customers:delete') remove(@Tenant() membership:any,@Param('id') id:string,@Req() req:any){return this.service.remove(membership.organizationId,req.auth.userId,id,req)}
}

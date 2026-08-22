import {Body,Controller,Get,Param,Post,Query,Req,UseGuards} from '@nestjs/common';
import {AuthGuard} from '../common/auth.guard';import {TenantContextGuard} from '../common/tenant-context.guard';import {RequirePermission,RbacGuard} from '../common/rbac';import {ExpensesService} from './expenses.service';import {CreateExpenseDto,PayExpenseDto} from './expenses.dto';
@Controller('expenses') @UseGuards(AuthGuard,TenantContextGuard,RbacGuard)
export class ExpensesController {constructor(private readonly e:ExpensesService){} private ctx(r:any){return {org:r.organizationId,user:r.auth.userId}}
 @Get() @RequirePermission('expenses.read') list(@Req()r:any,@Query('status')status?:string){return this.e.list(this.ctx(r).org,status)}
 @Post() @RequirePermission('expenses.write') create(@Req()r:any,@Body()d:CreateExpenseDto){return this.e.create(this.ctx(r).org,this.ctx(r).user,d,r)}
 @Post(':id/approve') @RequirePermission('expenses.approve') approve(@Req()r:any,@Param('id')id:string){return this.e.approve(this.ctx(r).org,this.ctx(r).user,id,r)}
 @Post(':id/reject') @RequirePermission('expenses.approve') reject(@Req()r:any,@Param('id')id:string){return this.e.reject(this.ctx(r).org,this.ctx(r).user,id,r)}
 @Post(':id/pay') @RequirePermission('expenses.pay') pay(@Req()r:any,@Param('id')id:string,@Body()d:PayExpenseDto){return this.e.pay(this.ctx(r).org,this.ctx(r).user,id,d,r)}
}

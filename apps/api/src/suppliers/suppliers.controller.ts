import {Body,Controller,Get,Param,Post,Req,UseGuards} from '@nestjs/common';
import {SuppliersService} from './suppliers.service';
import {AuthGuard} from '../common/auth.guard';import {RequirePermission,RbacGuard} from '../common/rbac';import {TenantContextGuard} from '../common/tenant-context.guard';
import {CreateSupplierBillDto,CreateSupplierDto,CreateSupplierPaymentDto} from './suppliers.dto';
@Controller('suppliers') @UseGuards(AuthGuard,TenantContextGuard,RbacGuard)
export class SuppliersController {constructor(private readonly s:SuppliersService){} private c(r:any){return {org:r.organizationId,user:r.auth.userId}}
@Get() @RequirePermission('finance.read') list(@Req()r:any){return this.s.list(this.c(r).org)}
@Post() @RequirePermission('finance.write') create(@Req()r:any,@Body()d:CreateSupplierDto){return this.s.create(this.c(r).org,this.c(r).user,d,r)}
@Get('bills') @RequirePermission('finance.read') bills(@Req()r:any){return this.s.bills(this.c(r).org)}
@Post('bills') @RequirePermission('finance.write') bill(@Req()r:any,@Body()d:CreateSupplierBillDto){return this.s.createBill(this.c(r).org,this.c(r).user,d,r)}
@Post('bills/:id/post') @RequirePermission('finance.write') post(@Req()r:any,@Param('id')id:string){return this.s.postBill(this.c(r).org,this.c(r).user,id,r)}
@Get('balances') @RequirePermission('finance.read') balances(@Req()r:any){return this.s.balances(this.c(r).org)}
@Get('payments') @RequirePermission('finance.read') payments(@Req()r:any){return this.s.payments(this.c(r).org)}
@Post('payments') @RequirePermission('finance.write') pay(@Req()r:any,@Body()d:CreateSupplierPaymentDto){return this.s.pay(this.c(r).org,this.c(r).user,d,r)} }

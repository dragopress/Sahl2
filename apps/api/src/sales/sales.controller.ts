import {Body,Controller,Get,Param,Post,Query,Req,UseGuards} from '@nestjs/common';
import {AuthGuard} from '../common/auth.guard';import {TenantContextGuard} from '../common/tenant-context.guard';import {Tenant} from '../common/tenant.decorator';import {RequirePermission,RbacGuard} from '../common/rbac';import {CreateInvoiceDto,CreatePaymentDto,CreateQuoteDto} from './sales.dto';import {SalesService} from './sales.service';
@Controller() @UseGuards(AuthGuard,TenantContextGuard,RbacGuard)
export class SalesController{constructor(private readonly service:SalesService){}
 @Get('quotes') @RequirePermission('quotes:read') quotes(@Tenant() m:any,@Query('status') status?:string){return this.service.quotes(m.organizationId,status)}
 @Get('quotes/:id') @RequirePermission('quotes:read') quote(@Tenant() m:any,@Param('id') id:string){return this.service.quote(m.organizationId,id)}
 @Post('quotes') @RequirePermission('quotes:write') createQuote(@Tenant() m:any,@Body() dto:CreateQuoteDto,@Req() req:any){return this.service.createQuote(m.organizationId,req.auth.userId,dto,req)}
 @Post('quotes/:id/send') @RequirePermission('quotes:send') sendQuote(@Tenant() m:any,@Param('id') id:string,@Req() req:any){return this.service.sendQuote(m.organizationId,req.auth.userId,id,req)}
 @Post('quotes/:id/convert') @RequirePermission('invoices:write') convert(@Tenant() m:any,@Param('id') id:string,@Req() req:any){return this.service.convertQuote(m.organizationId,req.auth.userId,id,req)}
 @Get('invoices') @RequirePermission('invoices:read') invoices(@Tenant() m:any,@Query('status') status?:string){return this.service.invoices(m.organizationId,status)}
 @Get('invoices/:id') @RequirePermission('invoices:read') invoice(@Tenant() m:any,@Param('id') id:string){return this.service.invoice(m.organizationId,id)}
 @Post('invoices') @RequirePermission('invoices:write') createInvoice(@Tenant() m:any,@Body() dto:CreateInvoiceDto,@Req() req:any){return this.service.createInvoice(m.organizationId,req.auth.userId,dto,req)}
 @Post('invoices/:id/send') @RequirePermission('invoices:send') sendInvoice(@Tenant() m:any,@Param('id') id:string,@Req() req:any){return this.service.sendInvoice(m.organizationId,req.auth.userId,id,req)}
 @Post('invoices/:id/cancel') @RequirePermission('invoices:cancel') cancel(@Tenant() m:any,@Param('id') id:string,@Req() req:any){return this.service.cancelInvoice(m.organizationId,req.auth.userId,id,req)}
 @Get('payments') @RequirePermission('payments:read') payments(@Tenant() m:any){return this.service.payments(m.organizationId)}
 @Post('payments') @RequirePermission('payments:write') createPayment(@Tenant() m:any,@Body() dto:CreatePaymentDto,@Req() req:any){return this.service.createPayment(m.organizationId,req.auth.userId,dto,req)}
}

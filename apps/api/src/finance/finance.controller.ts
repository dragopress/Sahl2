import {Body,Controller,Get,Param,Post,Query,Req,UseGuards} from '@nestjs/common';
import {FinanceService} from './finance.service';
import {AuthGuard} from '../common/auth.guard';
import {RequirePermission,RbacGuard} from '../common/rbac';
import {TenantContextGuard} from '../common/tenant-context.guard';
import {CreateAccountDto,CreateCashAccountDto,CashTransactionDto,ManualJournalDto} from './finance.dto';
@Controller('finance') @UseGuards(AuthGuard,TenantContextGuard,RbacGuard)
export class FinanceController { constructor(private readonly f:FinanceService){} private ctx(req:any){return {org:req.organizationId,user:req.auth.userId}} 
 @Get('accounts') @RequirePermission('finance.read') accounts(@Req()r:any){return this.f.accounts(this.ctx(r).org)}
 @Post('accounts/seed') @RequirePermission('finance.write') seed(@Req()r:any){return this.f.seedChart(this.ctx(r).org,this.ctx(r).user)}
 @Post('accounts') @RequirePermission('finance.write') createAccount(@Req()r:any,@Body()d:CreateAccountDto){return this.f.createAccount(this.ctx(r).org,this.ctx(r).user,d,r)}
 @Get('cash-accounts') @RequirePermission('finance.read') cashAccounts(@Req()r:any){return this.f.cashAccounts(this.ctx(r).org)}
 @Post('cash-accounts') @RequirePermission('finance.write') createCash(@Req()r:any,@Body()d:CreateCashAccountDto){return this.f.createCashAccount(this.ctx(r).org,this.ctx(r).user,d,r)}
 @Get('cash-transactions') @RequirePermission('finance.read') cashTx(@Req()r:any){return this.f.cashTransactions(this.ctx(r).org)}
 @Post('cash-transactions') @RequirePermission('finance.write') addCash(@Req()r:any,@Body()d:CashTransactionDto){return this.f.addCashTransaction(this.ctx(r).org,this.ctx(r).user,d,r)}
 @Post('journals/manual') @RequirePermission('finance.write') manual(@Req()r:any,@Body()d:ManualJournalDto){return this.f.postManual(this.ctx(r).org,this.ctx(r).user,d,r)}
 @Post('post/invoice/:id') @RequirePermission('finance.write') postInvoice(@Req()r:any,@Param('id')id:string){return this.f.postInvoice(this.ctx(r).org,this.ctx(r).user,id,r)}
 @Post('post/payment/:id') @RequirePermission('finance.write') postPayment(@Req()r:any,@Param('id')id:string,@Query('cashAccountId')cash:string){if(!cash)throw new Error('cashAccountId requis');return this.f.postPayment(this.ctx(r).org,this.ctx(r).user,id,cash,r)}
 @Post('post/expense/:id') @RequirePermission('finance.write') postExpense(@Req()r:any,@Param('id')id:string,@Query('cashAccountId')cash:string){if(!cash)throw new Error('cashAccountId requis');return this.f.postExpense(this.ctx(r).org,this.ctx(r).user,id,cash,r)}
 @Get('ledger') @RequirePermission('finance.read') ledger(@Req()r:any,@Query('from')from?:string,@Query('to')to?:string){return this.f.ledger(this.ctx(r).org,from,to)}
 @Get('trial-balance') @RequirePermission('finance.read') tb(@Req()r:any,@Query('from')from?:string,@Query('to')to?:string){return this.f.trialBalance(this.ctx(r).org,from,to)}
 @Get('pnl') @RequirePermission('finance.read') pnl(@Req()r:any,@Query('from')from?:string,@Query('to')to?:string){return this.f.pnl(this.ctx(r).org,from,to)}
 @Get('vat-report') @RequirePermission('finance.read') vat(@Req()r:any,@Query('from')from?:string,@Query('to')to?:string){return this.f.vatReport(this.ctx(r).org,from,to)}
 @Get('cash-position') @RequirePermission('finance.read') cash(@Req()r:any){return this.f.cashPosition(this.ctx(r).org)}
 @Get('cashflow-forecast') @RequirePermission('finance.read') forecast(@Req()r:any,@Query('days')days?:string){return this.f.cashflowForecast(this.ctx(r).org,Number(days||30))}
}

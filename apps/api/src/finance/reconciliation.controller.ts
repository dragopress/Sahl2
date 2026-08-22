import {Body,Controller,Get,Param,Post,Query,Req,UseGuards} from '@nestjs/common';import {AuthGuard} from '../common/auth.guard';import {RequirePermission,RbacGuard} from '../common/rbac';import {TenantContextGuard} from '../common/tenant-context.guard';import {ReconciliationService} from './reconciliation.service';import {ImportBankLineDto,MatchBankLineDto} from './reconciliation.dto';
@Controller('finance/reconciliation') @UseGuards(AuthGuard,TenantContextGuard,RbacGuard)
export class ReconciliationController{constructor(private readonly s:ReconciliationService){} private c(r:any){return {org:r.organizationId,user:r.auth.userId}}
@Get('lines') @RequirePermission('finance.read') lines(@Req()r:any,@Query('cashAccountId')cash:string,@Query('status')status?:string){if(!cash)throw new Error('cashAccountId requis');return this.s.lines(this.c(r).org,cash,status)}
@Post('lines') @RequirePermission('finance.write') importLine(@Req()r:any,@Body()d:ImportBankLineDto){return this.s.importLine(this.c(r).org,this.c(r).user,d,r)}
@Get('lines/:id/suggestions') @RequirePermission('finance.read') suggestions(@Req()r:any,@Param('id')id:string){return this.s.suggestions(this.c(r).org,id)}
@Post('lines/:id/match') @RequirePermission('finance.write') match(@Req()r:any,@Param('id')id:string,@Body()d:MatchBankLineDto){return this.s.match(this.c(r).org,this.c(r).user,id,d,r)}
@Post('lines/:id/unmatch') @RequirePermission('finance.write') unmatch(@Req()r:any,@Param('id')id:string){return this.s.unmatch(this.c(r).org,this.c(r).user,id,r)}
@Get('summary') @RequirePermission('finance.read') summary(@Req()r:any,@Query('cashAccountId')cash:string){if(!cash)throw new Error('cashAccountId requis');return this.s.summary(this.c(r).org,cash)}}

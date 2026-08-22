import {Body,Controller,Get,Param,Post,Query,Req,UseGuards} from '@nestjs/common';
import {AuthGuard} from '../common/auth.guard';
import {TenantContextGuard} from '../common/tenant-context.guard';
import {RbacGuard,RequirePermission} from '../common/rbac';
import {AiService} from './ai.service';

@Controller('ai')
@UseGuards(AuthGuard,TenantContextGuard,RbacGuard)
export class AiController {
 constructor(private readonly ai:AiService){}

 @Get('insights')
 @RequirePermission('ai:read')
 insights(@Req() req:any,@Query('limit') limit?:string){return this.ai.insights(req.organizationId,req.auth.userId,Math.min(Math.max(Number(limit||8),1),20));}

 @Post('insights/:id/dismiss')
 @RequirePermission('ai:write')
 dismiss(@Req() req:any,@Param('id') id:string){return this.ai.dismiss(req.organizationId,id);}

 @Post('ask')
 @RequirePermission('ai:read')
 ask(@Req() req:any,@Body() body:{question:string}){return this.ai.ask(req.organizationId,body?.question||'');}

 @Get('context')
 @RequirePermission('ai:read')
 context(@Req() req:any){return this.ai.context(req.organizationId);}
}

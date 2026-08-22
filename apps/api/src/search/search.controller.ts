import {Controller,Get,Query,Req,UseGuards} from '@nestjs/common';
import {AuthGuard} from '../common/auth.guard';
import {TenantContextGuard} from '../common/tenant-context.guard';
import {RbacGuard,RequirePermission} from '../common/rbac';
import {SearchService} from './search.service';
import {SearchDto} from './search.dto';

@Controller('search')
@UseGuards(AuthGuard,TenantContextGuard,RbacGuard)
export class SearchController{
 constructor(private readonly search:SearchService){}
 @Get() @RequirePermission('search:read') searchAll(@Req()r:any,@Query()q:SearchDto){return this.search.search(r.organizationId,r.auth.userId,q)}
}

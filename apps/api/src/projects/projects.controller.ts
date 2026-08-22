import {Body,Controller,Get,Param,Patch,Post,Query,Req,UseGuards} from '@nestjs/common';
import {AuthGuard} from '../common/auth.guard';import {TenantContextGuard} from '../common/tenant-context.guard';import {Tenant} from '../common/tenant.decorator';import {RequirePermission,RbacGuard} from '../common/rbac';import {CreateProjectDto,CreateTaskDto,UpdateProjectDto,UpdateTaskDto} from './projects.dto';import {ProjectsService} from './projects.service';
@Controller() @UseGuards(AuthGuard,TenantContextGuard,RbacGuard)
export class ProjectsController { constructor(private readonly service:ProjectsService){}
 @Get('projects') @RequirePermission('projects:read') list(@Tenant() m:any){return this.service.list(m.organizationId)}
 @Get('projects/profitability') @RequirePermission('projects:read') profitability(@Tenant() m:any){return this.service.profitability(m.organizationId)}
 @Get('projects/:id') @RequirePermission('projects:read') get(@Tenant() m:any,@Param('id') id:string){return this.service.get(m.organizationId,id)}
 @Post('projects') @RequirePermission('projects:write') create(@Tenant() m:any,@Body() dto:CreateProjectDto,@Req() req:any){return this.service.create(m.organizationId,req.auth.userId,dto,req)}
 @Patch('projects/:id') @RequirePermission('projects:write') update(@Tenant() m:any,@Param('id') id:string,@Body() dto:UpdateProjectDto,@Req() req:any){return this.service.update(m.organizationId,req.auth.userId,id,dto,req)}
 @Get('tasks') @RequirePermission('tasks:read') tasks(@Tenant() m:any,@Query('projectId') projectId?:string){return this.service.tasks(m.organizationId,projectId)}
 @Post('tasks') @RequirePermission('tasks:write') createTask(@Tenant() m:any,@Body() dto:CreateTaskDto,@Req() req:any){return this.service.createTask(m.organizationId,req.auth.userId,dto,req)}
 @Patch('tasks/:id') @RequirePermission('tasks:write') updateTask(@Tenant() m:any,@Param('id') id:string,@Body() dto:UpdateTaskDto,@Req() req:any){return this.service.updateTask(m.organizationId,req.auth.userId,id,dto,req)}
}

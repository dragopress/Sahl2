import {Body,Controller,Delete,Get,Param,Post,Query,Req,Res,UploadedFile,UseGuards,UseInterceptors} from '@nestjs/common';
import {FileInterceptor} from '@nestjs/platform-express';
import {Response} from 'express';
import {AuthGuard} from '../common/auth.guard';import {TenantContextGuard} from '../common/tenant-context.guard';import {RbacGuard,RequirePermission} from '../common/rbac';
import {CreateDocumentDto,CreateTagDto,ListDocumentsDto} from './documents.dto';import {DocumentsService} from './documents.service';
@Controller('documents') @UseGuards(AuthGuard,TenantContextGuard,RbacGuard) export class DocumentsController {constructor(private readonly d:DocumentsService){}
 @Get() @RequirePermission('documents:read') list(@Req()r:any,@Query()q:ListDocumentsDto){return this.d.list(r.organizationId,r.auth.userId,q)}
 @Post() @UseInterceptors(FileInterceptor('file')) @RequirePermission('documents:write') create(@Req()r:any,@UploadedFile()file:any,@Body()dto:CreateDocumentDto){return this.d.create(r.organizationId,r.auth.userId,file,dto,r)}
 @Post(':id/versions') @UseInterceptors(FileInterceptor('file')) @RequirePermission('documents:write') version(@Req()r:any,@Param('id')id:string,@UploadedFile()file:any){return this.d.addVersion(r.organizationId,r.auth.userId,id,file,r)}
 @Get(':id/download') @RequirePermission('documents:read') async download(@Req()r:any,@Param('id')id:string,@Query('version')version?:string,@Res()res?:Response){const x=await this.d.download(r.organizationId,r.auth.userId,id,version?Number(version):undefined);res!.setHeader('Content-Type',x.mimeType);res!.setHeader('Content-Length',x.sizeBytes);res!.setHeader('Content-Disposition',`attachment; filename="${x.name.replace(/"/g,'')}"`);x.body.pipe(res!);}
 @Get(':id/preview') @RequirePermission('documents:read') async preview(@Req()r:any,@Param('id')id:string,@Query('version')version?:string,@Res()res?:Response){const x=await this.d.download(r.organizationId,r.auth.userId,id,version?Number(version):undefined);res!.setHeader('Content-Type',x.mimeType);res!.setHeader('Content-Length',x.sizeBytes);res!.setHeader('Content-Disposition',`inline; filename="${x.name.replace(/"/g,'')}"`);x.body.pipe(res!);}
 @Get(':id/url') @RequirePermission('documents:read') signed(@Req()r:any,@Param('id')id:string){return this.d.signedUrl(r.organizationId,r.auth.userId,id)}
 @Delete(':id') @RequirePermission('documents:write') remove(@Req()r:any,@Param('id')id:string){return this.d.remove(r.organizationId,r.auth.userId,id,r)}
 @Get('meta/tags') @RequirePermission('documents:read') tags(@Req()r:any){return this.d.tags(r.organizationId)}
 @Post('meta/tags') @RequirePermission('documents:write') tag(@Req()r:any,@Body()dto:CreateTagDto){return this.d.createTag(r.organizationId,dto.name)}
 @Get('meta/expiring') @RequirePermission('documents:read') expiring(@Req()r:any,@Query('days')days?:string){return this.d.expiring(r.organizationId,days?Number(days):30)}
}

import {BadRequestException,ForbiddenException,Injectable,NotFoundException} from '@nestjs/common';
import {createHash} from 'crypto';
import {PrismaService} from '../common/prisma.service';
import {AuditService} from '../common/audit.service';
import {DocumentCategory,DocumentVisibility} from '@prisma/client';
import {storageProvider,StorageProvider} from '@sahlbiz/storage';
import {CreateDocumentDto,ListDocumentsDto} from './documents.dto';

@Injectable()
export class DocumentsService {
 private readonly storage:StorageProvider=storageProvider();
 constructor(private readonly prisma:PrismaService,private readonly audit:AuditService){}
 private async assertAccess(orgId:string,userId:string,id:string,write=false){
  const doc=await this.prisma.document.findFirst({where:{id,organizationId:orgId},include:{permissions:true}});
  if(!doc)throw new NotFoundException('Document not found');
  if(doc.visibility===DocumentVisibility.RESTRICTED && !doc.permissions.some(p=>p.userId===userId) && doc.createdById!==userId)throw new ForbiddenException('Document access denied');
  if(write && doc.createdById!==userId && !doc.permissions.some(p=>p.userId===userId))throw new ForbiddenException('Document write access denied');
  return doc;
 }
 private safe(doc:any){return {...doc,sizeBytes:Number(doc.sizeBytes),versions:doc.versions?.map((v:any)=>({...v,sizeBytes:Number(v.sizeBytes)}))};}
 async list(orgId:string,userId:string,q:ListDocumentsDto){
  const page=q.page||1,pageSize=Math.min(q.pageSize||25,100); const where:any={organizationId:orgId};
  if(q.category)where.category=q.category;if(q.entityType)where.entityType=q.entityType;if(q.entityId)where.entityId=q.entityId;
  if(q.search)where.OR=[{name:{contains:q.search,mode:'insensitive'}},{entityType:{contains:q.search,mode:'insensitive'}},{entityId:{contains:q.search,mode:'insensitive'}}];
  const docs=await this.prisma.document.findMany({where,include:{tags:true,versions:{orderBy:{version:'desc'},take:1}},orderBy:{createdAt:'desc'},skip:(page-1)*pageSize,take:pageSize});
  const visible=docs.filter((d:any)=>d.visibility!==DocumentVisibility.RESTRICTED||d.createdById===userId||d.permissions?.some((p:any)=>p.userId===userId));
  const total=await this.prisma.document.count({where}); return {items:visible.map(d=>this.safe(d)),page,pageSize,total};
 }
 async create(orgId:string,userId:string,file:any,dto:CreateDocumentDto,req:any){
  if(!file?.buffer||!file.originalname)throw new BadRequestException('File is required');
  if(file.size>20*1024*1024)throw new BadRequestException('Maximum file size is 20 MB');
  const requestedUsers=[...(dto.userIds||[])].filter(id=>id!==userId);
  if(requestedUsers.length){const members=await this.prisma.membership.findMany({where:{organizationId:orgId,userId:{in:requestedUsers}},select:{userId:true}});if(members.length!==requestedUsers.length)throw new BadRequestException('All document users must belong to the organization');}
  const checksum=createHash('sha256').update(file.buffer).digest('hex'); const key=`${orgId}/${new Date().getFullYear()}/${cryptoRandom()}/${sanitize(file.originalname)}`;
  await this.storage.put(key,file.buffer,file.mimetype||'application/octet-stream',checksum);
  const doc=await this.prisma.document.create({data:{organizationId:orgId,name:file.originalname,category:dto.category,visibility:dto.visibility||DocumentVisibility.ORGANIZATION,mimeType:file.mimetype||'application/octet-stream',sizeBytes:file.size,storageKey:key,checksum,entityType:dto.entityType,entityId:dto.entityId,expiresAt:dto.expiresAt?new Date(dto.expiresAt):undefined,createdById:userId,versions:{create:{version:1,storageKey:key,mimeType:file.mimetype||'application/octet-stream',sizeBytes:file.size,checksum,createdById:userId}},tags:dto.tags?.length?{connectOrCreate:dto.tags.map(name=>({where:{organizationId_name:{organizationId:orgId,name}},create:{organizationId:orgId,name}}))}:undefined,permissions:dto.userIds?.length?{create:dto.userIds.filter(id=>id!==userId).map(userId=>({organizationId:orgId,userId}))}:undefined},include:{tags:true,versions:true}});
  await this.audit.record({organizationId:orgId,userId,action:'CREATE',entity:'Document',entityId:doc.id,next:{name:doc.name,category:doc.category,sizeBytes:file.size},ip:req?.ip,userAgent:req?.headers?.['user-agent']}); return this.safe(doc);
 }
 async addVersion(orgId:string,userId:string,id:string,file:any,req:any){
  const doc=await this.assertAccess(orgId,userId,id,true); if(!file?.buffer)throw new BadRequestException('File is required'); if(file.size>20*1024*1024)throw new BadRequestException('Maximum file size is 20 MB');
  const version=doc.currentVersion+1; const checksum=createHash('sha256').update(file.buffer).digest('hex'); const key=`${orgId}/${new Date().getFullYear()}/${id}/v${version}-${sanitize(file.originalname)}`;
  await this.storage.put(key,file.buffer,file.mimetype||'application/octet-stream',checksum);
  const updated=await this.prisma.$transaction(async tx=>{const v=await tx.documentVersion.create({data:{documentId:id,version,storageKey:key,mimeType:file.mimetype||'application/octet-stream',sizeBytes:file.size,checksum,createdById:userId}});return tx.document.update({where:{id},data:{name:file.originalname,mimeType:v.mimeType,sizeBytes:v.sizeBytes,storageKey:key,checksum,currentVersion:version},include:{versions:{orderBy:{version:'desc'}},tags:true}})});
  await this.audit.record({organizationId:orgId,userId,action:'VERSION',entity:'Document',entityId:id,next:{version,sizeBytes:file.size},ip:req?.ip,userAgent:req?.headers?.['user-agent']}); return this.safe(updated);
 }
 async download(orgId:string,userId:string,id:string,version?:number){const doc=await this.assertAccess(orgId,userId,id); const v=version?await this.prisma.documentVersion.findFirst({where:{documentId:id,version}}):await this.prisma.documentVersion.findFirst({where:{documentId:id,version:doc.currentVersion}}); if(!v)throw new NotFoundException('Version not found'); return {...await this.storage.get(v.storageKey),name:doc.name,mimeType:v.mimeType,sizeBytes:Number(v.sizeBytes),version:v.version};}
 async signedUrl(orgId:string,userId:string,id:string){const doc=await this.assertAccess(orgId,userId,id);return {url:await this.storage.signedDownloadUrl(doc.storageKey),expiresIn:300};}
 async remove(orgId:string,userId:string,id:string,req:any){const doc=await this.assertAccess(orgId,userId,id,true);const versions=await this.prisma.documentVersion.findMany({where:{documentId:id}});for(const v of versions)await this.storage.delete(v.storageKey);await this.prisma.document.delete({where:{id}});await this.audit.record({organizationId:orgId,userId,action:'DELETE',entity:'Document',entityId:id,previous:{name:doc.name},ip:req?.ip,userAgent:req?.headers?.['user-agent']});return {deleted:true};}
 async tags(orgId:string){return this.prisma.documentTag.findMany({where:{organizationId:orgId},orderBy:{name:'asc'}})}
 async createTag(orgId:string,name:string){return this.prisma.documentTag.upsert({where:{organizationId_name:{organizationId:orgId,name:name.trim()}},update:{},create:{organizationId:orgId,name:name.trim()}})}
 async expiring(orgId:string,days=30){const until=new Date(Date.now()+days*86400000);return this.prisma.document.findMany({where:{organizationId:orgId,expiresAt:{not:null,lte:until,gte:new Date()}},orderBy:{expiresAt:'asc'},include:{tags:true}})}
}
function sanitize(name:string){return name.replace(/[^a-zA-Z0-9._-]/g,'_').slice(-120)}
function cryptoRandom(){return createHash('sha256').update(`${Date.now()}-${Math.random()}`).digest('hex').slice(0,24)}

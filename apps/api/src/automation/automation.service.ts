import {BadRequestException,Injectable,NotFoundException} from '@nestjs/common';
import {PrismaService} from '../common/prisma.service';
import {AuditService} from '../common/audit.service';
import {CreateAutomationRuleDto} from './automation.dto';

@Injectable() export class AutomationService {
 constructor(private readonly db:PrismaService,private readonly audit:AuditService){}
 async notifications(org:string,userId?:string){return this.db.notification.findMany({where:{organizationId:org,...(userId?{OR:[{userId},{userId:null}]}:{})},orderBy:{createdAt:'desc'},take:100});}
 async unread(org:string,userId:string){return this.db.notification.count({where:{organizationId:org,readAt:null,OR:[{userId},{userId:null}]}});}
 async read(org:string,userId:string,id:string){const n=await this.db.notification.findFirst({where:{id,organizationId:org,OR:[{userId},{userId:null}]}});if(!n)throw new NotFoundException('Notification introuvable.');return this.db.notification.update({where:{id},data:{readAt:new Date(),userId:n.userId||userId}});}
 async readAll(org:string,userId:string){await this.db.notification.updateMany({where:{organizationId:org,readAt:null,OR:[{userId},{userId:null}]},data:{readAt:new Date()}});return {ok:true};}
 async rules(org:string){return this.db.automationRule.findMany({where:{organizationId:org},orderBy:{createdAt:'asc'}});}
 async createRule(org:string,userId:string,dto:CreateAutomationRuleDto,request:any){const exists=await this.db.automationRule.findFirst({where:{organizationId:org,name:dto.name.trim()}});if(exists)throw new BadRequestException('Une règle porte déjà ce nom.');const r=await this.db.automationRule.create({data:{organizationId:org,name:dto.name.trim(),type:dto.type as any,enabled:dto.enabled??true,config:dto.config??{}}});await this.audit.record({organizationId:org,userId,action:'CREATE',entity:'AutomationRule',entityId:r.id,next:r,ip:request.ip,userAgent:request.headers['user-agent']});return r;}
 async updateRule(org:string,userId:string,id:string,dto:Partial<CreateAutomationRuleDto>,request:any){const before=await this.db.automationRule.findFirst({where:{id,organizationId:org}});if(!before)throw new NotFoundException('Règle introuvable.');const r=await this.db.automationRule.update({where:{id},data:{name:dto.name?.trim(),type:dto.type as any,enabled:dto.enabled,config:dto.config as any}});await this.audit.record({organizationId:org,userId,action:'UPDATE',entity:'AutomationRule',entityId:id,previous:before,next:r,ip:request.ip,userAgent:request.headers['user-agent']});return r;}
}

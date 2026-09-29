import {BadRequestException,Injectable,NotFoundException} from '@nestjs/common';
import {PrismaService} from '../common/prisma.service';
import {AuditService} from '../common/audit.service';
import {CreateOpportunityDto} from './opportunities.dto';

@Injectable()
export class OpportunitiesService {
  constructor(private readonly prisma:PrismaService,private readonly audit:AuditService){}
  async list(org:string){
    return this.prisma.opportunity.findMany({where:{organizationId:org},include:{customer:true},orderBy:{updatedAt:'desc'}});
  }
  async create(org:string,userId:string,dto:CreateOpportunityDto,request:any){
    const title=dto.title.trim();
    if(!title) throw new BadRequestException('Opportunity title is required');
    if(dto.customerId){
      const customer=await this.prisma.customer.findFirst({where:{id:dto.customerId,organizationId:org}});
      if(!customer) throw new NotFoundException('Customer not found');
    }
    const opportunity=await this.prisma.opportunity.create({data:{
      organizationId:org,title,customerId:dto.customerId,stage:dto.stage?.trim()||'LEAD',
      value:dto.value??0,probability:dto.probability??0,
      expectedClose:dto.expectedClose?new Date(dto.expectedClose):undefined,notes:dto.notes?.trim()
    },include:{customer:true}});
    await this.audit.record({organizationId:org,userId,action:'CREATE',entity:'Opportunity',entityId:opportunity.id,next:opportunity,ip:request.ip,userAgent:request.headers['user-agent']});
    return opportunity;
  }
  async update(org:string,userId:string,id:string,dto:CreateOpportunityDto,request:any){
    const previous=await this.prisma.opportunity.findFirst({where:{id,organizationId:org}});
    if(!previous) throw new NotFoundException('Opportunity not found');
    if(dto.customerId){
      const customer=await this.prisma.customer.findFirst({where:{id:dto.customerId,organizationId:org}});
      if(!customer) throw new NotFoundException('Customer not found');
    }
    const opportunity=await this.prisma.opportunity.update({where:{id},data:{
      title:dto.title.trim(),customerId:dto.customerId??previous.customerId,stage:dto.stage?.trim()||previous.stage,
      value:dto.value??Number(previous.value),probability:dto.probability??previous.probability,
      expectedClose:dto.expectedClose?new Date(dto.expectedClose):previous.expectedClose,notes:dto.notes?.trim()??previous.notes
    },include:{customer:true}});
    await this.audit.record({organizationId:org,userId,action:'UPDATE',entity:'Opportunity',entityId:id,previous,next:opportunity,ip:request.ip,userAgent:request.headers['user-agent']});
    return opportunity;
  }
  async remove(org:string,userId:string,id:string,request:any){
    const previous=await this.prisma.opportunity.findFirst({where:{id,organizationId:org}});
    if(!previous) throw new NotFoundException('Opportunity not found');
    await this.prisma.opportunity.delete({where:{id}});
    await this.audit.record({organizationId:org,userId,action:'DELETE',entity:'Opportunity',entityId:id,previous,ip:request.ip,userAgent:request.headers['user-agent']});
    return {ok:true};
  }
}
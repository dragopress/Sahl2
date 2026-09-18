import {Injectable} from '@nestjs/common';
import {PrismaService} from './prisma.service';

function toJsonValue(value:unknown):unknown{
  return JSON.parse(JSON.stringify(value,(_,item)=>{
    if(typeof item==='bigint') return item.toString();
    return item;
  }));
}

@Injectable()
export class AuditService{
  constructor(private readonly prisma:PrismaService){}

  async record(input:{
    organizationId:string;
    userId?:string;
    action:string;
    entity:string;
    entityId?:string;
    previous?:unknown;
    next?:unknown;
    ip?:string;
    userAgent?:string;
  }){
    return this.prisma.auditLog.create({
      data:{
        organizationId:input.organizationId,
        userId:input.userId,
        action:input.action,
        entity:input.entity,
        entityId:input.entityId,
        previous:input.previous===undefined?undefined:toJsonValue(input.previous) as any,
        next:input.next===undefined?undefined:toJsonValue(input.next) as any,
        ip:input.ip,
        userAgent:input.userAgent
      }
    });
  }
}

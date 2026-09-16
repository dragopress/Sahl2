import {createParamDecorator,ExecutionContext,ForbiddenException} from '@nestjs/common';
export const Tenant=createParamDecorator((_:unknown,ctx:ExecutionContext)=>{
 const req=ctx.switchToHttp().getRequest();
 const memberships=req.auth?.memberships??[];
 const id=req.headers['x-organization-id'];
 if(typeof id!=='string')throw new ForbiddenException('Organization context required');
 const membership=memberships.find((m:any)=>m.organizationId===id);
 if(!membership)throw new ForbiddenException('Organization access denied');
 req.membership=membership;
 return membership;
});

import {createParamDecorator,ExecutionContext,ForbiddenException} from '@nestjs/common';
import {AuthenticatedRequest} from './request.types';
export const Tenant=createParamDecorator((_:unknown,ctx:ExecutionContext)=>{
 const req=ctx.switchToHttp().getRequest<AuthenticatedRequest>();
 const memberships=req.auth?.memberships??[];
 const requestedId=req.headers['x-organization-id'];
 const id=typeof requestedId==='string' ? requestedId : req.organizationId;
 const membership=id ? memberships.find(m=>m.organizationId===id) : undefined;
 if(!id||!membership)throw new ForbiddenException('Organization context required');
 req.membership=membership;
 req.organizationId=id;
 return membership;
});

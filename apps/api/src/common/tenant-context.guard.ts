import {CanActivate,ExecutionContext,Injectable,ForbiddenException} from '@nestjs/common';
import {AuthenticatedRequest} from './request.types';

@Injectable()
export class TenantContextGuard implements CanActivate {
  canActivate(ctx:ExecutionContext){
    const req=ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    const requestedId=req.headers['x-organization-id'];
    const memberships=req.auth?.memberships ?? [];

    const id=typeof requestedId==='string'
      ? requestedId
      : memberships.length===1
        ? memberships[0].organizationId
        : undefined;

    const membership=id
      ? memberships.find((m:{organizationId:string;role:string})=>m.organizationId===id)
      : undefined;

    if(!id||!membership) throw new ForbiddenException('Organization access denied');

    req.membership=membership;
    req.organizationId=id;
    return true;
  }
}

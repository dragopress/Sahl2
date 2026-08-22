import {CanActivate,ExecutionContext,Injectable,ForbiddenException} from '@nestjs/common';
@Injectable()
export class TenantContextGuard implements CanActivate{
 canActivate(ctx:ExecutionContext){
  const req=ctx.switchToHttp().getRequest();
  const id=req.headers['x-organization-id'];
  const membership=req.auth?.memberships?.find((m:any)=>m.organizationId===id);
  if(typeof id!=='string'||!membership)throw new ForbiddenException('Organization access denied');
  req.membership=membership; req.organizationId=id;
  return true;
 }
}

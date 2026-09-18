import {CanActivate,ExecutionContext,Injectable,ForbiddenException} from '@nestjs/common';
@Injectable()
export class TenantContextGuard implements CanActivate{
 /**
  * Resolves the organization membership for the current request and enforces tenant access.
  * @param ctx - The execution context containing the request
  * @returns True if access is granted
  * @throws ForbiddenException if the organization ID is invalid or the user lacks membership
  */
 canActivate(ctx:ExecutionContext){
  const req=ctx.switchToHttp().getRequest();
  const id=req.headers['x-organization-id'];
  const membership = req.auth?.memberships?.find(
  (m: { organizationId: string; role: string }) => m.organizationId === id
);
  if(typeof id!=='string'||!membership)throw new ForbiddenException('Organization access denied');
  req.membership=membership; req.organizationId=id;
  return true;
 }
}

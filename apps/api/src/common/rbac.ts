import {CanActivate,ExecutionContext,ForbiddenException,Injectable,SetMetadata} from '@nestjs/common';
import {Reflector} from '@nestjs/core';

export const PERMISSION_KEY='sahlbiz_permission';
export type Permission='customers:read'|'customers:write'|'customers:delete'|'organization:manage'|'audit:read'|'quotes:read'|'quotes:write'|'quotes:send'|'invoices:read'|'invoices:write'|'invoices:send'|'invoices:cancel'|'payments:read'|'payments:write'|'products:read'|'products:write'|'inventory:read'|'inventory:write'|'finance.read'|'finance.write'|'expenses.read'|'expenses.write'|'expenses.approve'|'expenses.pay'|'projects:read'|'projects:write'|'tasks:read'|'tasks:write'|'analytics:read'|'notifications:read'|'notifications:write'|'automation:read'|'automation:write'|'documents:read'|'documents:write'|'search:read'|'ai:read'|'ai:write';
export const RequirePermission=(permission:Permission)=>SetMetadata(PERMISSION_KEY,permission);

const ROLE_PERMISSIONS:Record<string,Permission[]>= {
 OWNER:['customers:read','customers:write','customers:delete','organization:manage','audit:read','quotes:read','quotes:write','quotes:send','invoices:read','invoices:write','invoices:send','invoices:cancel','payments:read','payments:write','products:read','products:write','inventory:read','inventory:write','finance.read','finance.write','expenses.read','expenses.write','expenses.approve','expenses.pay','projects:read','projects:write','tasks:read','tasks:write','analytics:read','notifications:read','notifications:write','automation:read','automation:write','documents:read','documents:write','search:read','ai:read','ai:write'],
 ADMIN:['customers:read','customers:write','customers:delete','organization:manage','audit:read','quotes:read','quotes:write','quotes:send','invoices:read','invoices:write','invoices:send','invoices:cancel','payments:read','payments:write','products:read','products:write','inventory:read','inventory:write','finance.read','finance.write','expenses.read','expenses.write','expenses.approve','expenses.pay','projects:read','projects:write','tasks:read','tasks:write','analytics:read','notifications:read','notifications:write','automation:read','automation:write','documents:read','documents:write','search:read','ai:read','ai:write'],
 MANAGER:['customers:read','customers:write','audit:read','quotes:read','quotes:write','quotes:send','invoices:read','invoices:write','invoices:send','payments:read','payments:write','products:read','products:write','inventory:read','inventory:write','finance.read','finance.write','expenses.read','expenses.write','expenses.approve','expenses.pay','projects:read','projects:write','tasks:read','tasks:write','analytics:read','notifications:read','notifications:write','automation:read','automation:write','documents:read','documents:write','search:read','ai:read'],
 SALES:['documents:read','search:read','customers:read','customers:write','quotes:read','quotes:write','quotes:send','invoices:read','invoices:write','invoices:send','products:read','inventory:read'],
 ACCOUNTANT:['documents:read','search:read','documents:write','customers:read','quotes:read','invoices:read','invoices:write','invoices:send','invoices:cancel','payments:read','payments:write','products:read','inventory:read','finance.read','finance.write','expenses.read','expenses.write','expenses.approve','expenses.pay','projects:read','tasks:read','analytics:read','notifications:read'],
 EMPLOYEE:['documents:read','search:read','customers:read','quotes:read','invoices:read','payments:read','products:read','inventory:read','projects:read','tasks:read','tasks:write','analytics:read','notifications:read'],
 VIEWER:['documents:read','search:read','customers:read','quotes:read','invoices:read','payments:read','products:read','inventory:read','finance.read','expenses.read','projects:read','tasks:read','analytics:read','notifications:read'],
};
export function hasPermission(role:string,permission:Permission){return ROLE_PERMISSIONS[role]?.includes(permission)??false}

@Injectable()
export class RbacGuard implements CanActivate{
 constructor(private readonly reflector:Reflector){}
 canActivate(ctx:ExecutionContext){
  const permission=this.reflector.getAllAndOverride<Permission>(PERMISSION_KEY,[ctx.getHandler(),ctx.getClass()]);
  if(!permission)return true;
  const req=ctx.switchToHttp().getRequest();
  const membership=req.membership;
  if(!membership || !hasPermission(membership.role,permission)) throw new ForbiddenException('Permission denied');
  return true;
 }
}

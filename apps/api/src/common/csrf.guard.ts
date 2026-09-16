import {CanActivate,ExecutionContext,ForbiddenException,Injectable} from '@nestjs/common';

const SAFE_METHODS=new Set(['GET','HEAD','OPTIONS']);

@Injectable()
export class CsrfGuard implements CanActivate{
  canActivate(ctx:ExecutionContext){
    const req:any=ctx.switchToHttp().getRequest();
    if(SAFE_METHODS.has(String(req.method).toUpperCase())) return true;
    const cookie=String(req.headers?.cookie||'');
    if(!cookie.includes('sahlbiz_session=')) return true;

    const origin=String(req.headers?.origin||'').trim();
    const fetchSite=String(req.headers?.['sec-fetch-site']||'').toLowerCase();
    const allowed=this.allowedOrigins();
    if(origin && !allowed.includes(origin)) throw new ForbiddenException('Origin not allowed');
    if(fetchSite==='cross-site') throw new ForbiddenException('Cross-site request blocked');
    return true;
  }

  private allowedOrigins(){
    const configured=String(process.env.CORS_ORIGINS||'http://localhost:3000').split(',').map(v=>v.trim()).filter(Boolean);
    return configured;
  }
}

import {CanActivate,ExecutionContext,Injectable,UnauthorizedException} from '@nestjs/common';
import {AuthService} from '../auth/auth.service';
import {AuthenticatedRequest} from './request.types';

const COOKIE='sahlbiz_session';

function readAccessToken(req:AuthenticatedRequest){
  const bearer=req.headers.authorization;
  if(bearer?.startsWith('Bearer '))return bearer.slice(7);
  const value=req.headers.cookie?.split(';').map(v=>v.trim()).find(v=>v.startsWith(COOKIE+'='));
  if(!value)return undefined;
  try{
    const session=JSON.parse(decodeURIComponent(value.slice(COOKIE.length+1))) as {access_token?:string};
    return session.access_token;
  }catch{return undefined;}
}

@Injectable()
export class AuthGuard implements CanActivate{
  constructor(private readonly auth:AuthService){}
  async canActivate(ctx:ExecutionContext){
    const req=ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    const accessToken=readAccessToken(req);
    if(!accessToken)throw new UnauthorizedException('Authentication required');
    const session=await this.auth.me(accessToken);
    req.auth={userId:session.user.id,memberships:session.organizations};
    return true;
  }
}

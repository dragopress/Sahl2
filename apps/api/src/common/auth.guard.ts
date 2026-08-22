import {CanActivate,ExecutionContext,Injectable,UnauthorizedException} from '@nestjs/common';
import {Request} from 'express';
import {AuthService} from '../auth/auth.service';
@Injectable() export class AuthGuard implements CanActivate{constructor(private readonly auth:AuthService){}async canActivate(ctx:ExecutionContext){const req=ctx.switchToHttp().getRequest<Request>();const cookie=req.headers.cookie?.split(';').map(v=>v.trim()).find(v=>v.startsWith('sahlbiz_session='));const token=cookie?.slice('sahlbiz_session='.length);const session=await this.auth.getSession(token);if(!session)throw new UnauthorizedException('Authentication required');(req as any).auth={userId:session.userId,memberships:session.user.memberships};return true}}

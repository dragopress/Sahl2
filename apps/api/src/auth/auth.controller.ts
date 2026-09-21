import {Body,Controller,Get,Post,Req,Res,UnauthorizedException} from '@nestjs/common';
import {Request,Response} from 'express';
import {AuthService} from './auth.service';
import {LoginDto,RegisterDto} from './auth.dto';

const COOKIE='sahlbiz_session';
type Session={access_token:string;refresh_token:string;expires_in:number};

function readSession(req:Request):Session|null{
  const value=req.headers.cookie?.split(';').map(v=>v.trim()).find(v=>v.startsWith(COOKIE+'='));
  if(!value)return null;
  try{return JSON.parse(decodeURIComponent(value.slice(COOKIE.length+1))) as Session;}catch{return null;}
}

@Controller('auth')
export class AuthController{
  constructor(private readonly auth:AuthService){}

  private setSession(res:Response,session:Session){
    res.cookie(COOKIE,encodeURIComponent(JSON.stringify(session)),{
      httpOnly:true,
      secure:process.env.NODE_ENV==='production',
      sameSite:'lax',
      path:'/',
      maxAge:30*86400000,
    });
  }

  private clearSession(res:Response){
    res.clearCookie(COOKIE,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/'});
  }

  @Post('register')
  async register(@Body() dto:RegisterDto,@Res({passthrough:true}) res:Response){
    const result=await this.auth.register(dto);
    if(result.session)this.setSession(res,result.session);
    return {
      user:result.user,
      organizations:result.organizations,
      requiresEmailConfirmation:result.requiresEmailConfirmation,
    };
  }

  @Post('login')
  async login(@Body() dto:LoginDto,@Res({passthrough:true}) res:Response){
    const result=await this.auth.login(dto);
    this.setSession(res,result.session);
    return {user:result.user,organizations:result.organizations};
  }

  @Post('refresh')
  async refresh(@Req() req:Request,@Res({passthrough:true}) res:Response){
    const current=readSession(req);
    if(!current?.refresh_token)throw new UnauthorizedException('Refresh token required');
    const session=await this.auth.refresh(current.refresh_token);
    this.setSession(res,session);
    return {ok:true};
  }

  @Post('logout')
  async logout(@Req() req:Request,@Res({passthrough:true}) res:Response){
    const current=readSession(req);
    if(current?.access_token)await this.auth.signOut(current.access_token);
    this.clearSession(res);
    return {ok:true};
  }

  @Get('me')
  async me(@Req() req:Request){
    const current=readSession(req);
    if(!current?.access_token)throw new UnauthorizedException('Not authenticated');
    return this.auth.me(current.access_token);
  }
}

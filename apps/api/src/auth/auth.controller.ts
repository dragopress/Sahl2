import {Body,Controller,Get,Post,Req,Res,UnauthorizedException} from '@nestjs/common';
import {Request,Response} from 'express';
import {AuthService} from './auth.service';
import {LoginDto,RegisterDto} from './auth.dto';
const COOKIE='sahlbiz_session';
@Controller('auth') export class AuthController{constructor(private readonly auth:AuthService){}
 private setCookie(res:Response,token:string){res.cookie(COOKIE,token,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/',maxAge:30*86400000})}
 private token(req:Request){const header=req.headers.cookie?.split(';').map(v=>v.trim()).find(v=>v.startsWith(COOKIE+'='));return header?.slice(COOKIE.length+1)}
 @Post('register') async register(@Body() dto:RegisterDto,@Res({passthrough:true}) res:Response){const result=await this.auth.register(dto);this.setCookie(res,result.sessionToken);return {user:result.user,organizations:result.organizations}}
 @Post('login') async login(@Body() dto:LoginDto,@Res({passthrough:true}) res:Response){const result=await this.auth.login(dto);this.setCookie(res,result.sessionToken);return {user:result.user,organizations:result.organizations}}
 @Post('logout') async logout(@Req() req:Request,@Res({passthrough:true}) res:Response){await this.auth.logout(this.token(req));res.clearCookie(COOKIE,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/'});return {ok:true}}
 @Get('me') async me(@Req() req:Request){const session=await this.auth.getSession(this.token(req));if(!session)throw new UnauthorizedException('Not authenticated');return {user:{id:session.user.id,email:session.user.email,name:session.user.name},organizations:session.user.memberships}}
}

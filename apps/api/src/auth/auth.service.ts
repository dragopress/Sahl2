import {ConflictException,Injectable,UnauthorizedException} from '@nestjs/common';
import {PrismaService} from '../common/prisma.service';
import {createToken,hashPassword,hashToken,verifyPassword} from '../common/security/password';
import {LoginDto,RegisterDto} from './auth.dto';
import {SupabaseAuthService} from './supabase-auth.service';

type Session={access_token:string;refresh_token:string;expires_in:number};

@Injectable()
export class AuthService{
  constructor(
    private readonly prisma:PrismaService,
    private readonly supabase:SupabaseAuthService,
  ){}

  private useLegacyTestAuth(){return process.env.NODE_ENV==='test'&&!process.env.SUPABASE_URL;}

  private async createLegacySession(userId:string):Promise<Session>{
    const raw=createToken();
    await this.prisma.session.create({
      data:{
        userId,
        tokenHash:hashToken(raw),
        expiresAt:new Date(Date.now()+30*86400000),
      },
    });
    return {access_token:raw,refresh_token:raw,expires_in:30*86400};
  }

  private async legacySession(raw:string){
    const session=await this.prisma.session.findUnique({
      where:{tokenHash:hashToken(raw)},
      include:{user:{include:{memberships:{include:{organization:true}}}}},
    });
    if(!session||session.expiresAt<=new Date())return null;
    return session;
  }

  async register(dto:RegisterDto){
    const email=dto.email.trim().toLowerCase();
    const existing=await this.prisma.user.findUnique({where:{email}});
    if(existing)throw new ConflictException('Email already registered');

    if(this.useLegacyTestAuth()){
      const passwordHash=await hashPassword(dto.password);
      const user=await this.prisma.user.create({
        data:{
          email,
          name:dto.name.trim(),
          passwordHash,
          memberships:{create:{role:'OWNER',organization:{create:{
            name:dto.organizationName.trim(),
            slug:dto.organizationName.toLowerCase().normalize('NFKD').replace(/[\\u0300-\\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'')+'-'+createToken().slice(0,6),
          }}}},
        },
        include:{memberships:{include:{organization:true}}},
      });
      return {
        session:await this.createLegacySession(user.id),
        user:{id:user.id,email:user.email,name:user.name},
        organizations:user.memberships.map(m=>({id:m.organizationId,name:m.organization.name,role:m.role})),
        requiresEmailConfirmation:false,
      };
    }

    const auth=await this.supabase.signUp(email,dto.password,dto.name.trim());
    const supabaseUser=auth.user;
    if(!supabaseUser?.email)throw new UnauthorizedException('Supabase did not create the user');

    const slug=dto.organizationName.toLowerCase().normalize('NFKD').replace(/[\\u0300-\\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'')+'-'+supabaseUser.id.slice(0,6);
    const user=await this.prisma.user.create({
      data:{
        email,
        name:dto.name.trim(),
        passwordHash:null,
        memberships:{create:{role:'OWNER',organization:{create:{name:dto.organizationName.trim(),slug}}}},
      },
      include:{memberships:{include:{organization:true}}},
    });

    return {
      session:auth.session,
      user:{id:user.id,email:user.email,name:user.name},
      organizations:user.memberships.map(m=>({id:m.organizationId,name:m.organization.name,role:m.role})),
      requiresEmailConfirmation:!auth.session,
    };
  }

  async login(dto:LoginDto){
    const email=dto.email.trim().toLowerCase();

    if(this.useLegacyTestAuth()){
      const user=await this.prisma.user.findUnique({where:{email},include:{memberships:{include:{organization:true}}}});
      if(!user?.passwordHash||!(await verifyPassword(dto.password,user.passwordHash)))throw new UnauthorizedException('Invalid email or password');
      return {
        session:await this.createLegacySession(user.id),
        user:{id:user.id,email:user.email,name:user.name},
        organizations:user.memberships.map(m=>({id:m.organizationId,name:m.organization.name,role:m.role})),
      };
    }

    const auth=await this.supabase.signIn(email,dto.password);
    const authEmail=auth.user.email?.trim().toLowerCase();
    if(!authEmail)throw new UnauthorizedException('Authenticated user has no email');
    const user=await this.prisma.user.findUnique({where:{email:authEmail},include:{memberships:{include:{organization:true}}}});
    if(!user)throw new UnauthorizedException('User is not provisioned in SahlBiz');
    return {
      session:auth,
      user:{id:user.id,email:user.email,name:user.name},
      organizations:user.memberships.map(m=>({id:m.organizationId,name:m.organization.name,role:m.role})),
    };
  }

  async me(accessToken:string){
    if(this.useLegacyTestAuth()){
      const session=await this.legacySession(accessToken);
      if(!session)throw new UnauthorizedException('Authentication required');
      return {
        user:{id:session.user.id,email:session.user.email,name:session.user.name},
        organizations:session.user.memberships,
        supabaseUserId:null,
      };
    }

    const authUser=await this.supabase.getUser(accessToken);
    const email=authUser.email?.trim().toLowerCase();
    if(!email)throw new UnauthorizedException('Authenticated user has no email');
    const user=await this.prisma.user.findUnique({where:{email},include:{memberships:{include:{organization:true}}}});
    if(!user)throw new UnauthorizedException('User is not provisioned in SahlBiz');
    return {
      user:{id:user.id,email:user.email,name:user.name},
      organizations:user.memberships,
      supabaseUserId:authUser.id,
    };
  }

  async refresh(refreshToken:string){
    if(this.useLegacyTestAuth()){
      const session=await this.legacySession(refreshToken);
      if(!session)throw new UnauthorizedException('Refresh token required');
      return {access_token:refreshToken,refresh_token:refreshToken,expires_in:30*86400};
    }
    return this.supabase.refresh(refreshToken);
  }

  async signOut(accessToken:string){
    if(this.useLegacyTestAuth()){
      await this.prisma.session.deleteMany({where:{tokenHash:hashToken(accessToken)}});
      return;
    }
    return this.supabase.signOut(accessToken);
  }
}

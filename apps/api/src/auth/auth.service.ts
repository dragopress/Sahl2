import {ConflictException,Injectable,UnauthorizedException} from '@nestjs/common';
import {PrismaService} from '../common/prisma.service';
import {LoginDto,RegisterDto} from './auth.dto';
import {SupabaseAuthService} from './supabase-auth.service';

@Injectable()
export class AuthService{
  constructor(
    private readonly prisma:PrismaService,
    private readonly supabase:SupabaseAuthService,
  ){}

  async register(dto:RegisterDto){
    const email=dto.email.trim().toLowerCase();
    const existing=await this.prisma.user.findUnique({where:{email}});
    if(existing)throw new ConflictException('Email already registered');

    const auth=await this.supabase.signUp(email,dto.password,dto.name.trim());
    const supabaseUser=auth.user;
    if(!supabaseUser?.email)throw new UnauthorizedException('Supabase did not create the user');

    const slug=dto.organizationName.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'')+'-'+supabaseUser.id.slice(0,6);
    const user=await this.prisma.user.create({
      data:{
        email,
        name:dto.name.trim(),
        passwordHash:null,
        memberships:{
          create:{
            role:'OWNER',
            organization:{create:{name:dto.organizationName.trim(),slug}},
          },
        },
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
    const auth=await this.supabase.signIn(dto.email.trim().toLowerCase(),dto.password);
    const email=auth.user.email?.trim().toLowerCase();
    if(!email)throw new UnauthorizedException('Authenticated user has no email');
    const user=await this.prisma.user.findUnique({where:{email},include:{memberships:{include:{organization:true}}}});
    if(!user)throw new UnauthorizedException('User is not provisioned in SahlBiz');
    return {
      session:auth,
      user:{id:user.id,email:user.email,name:user.name},
      organizations:user.memberships.map(m=>({id:m.organizationId,name:m.organization.name,role:m.role})),
    };
  }

  async me(accessToken:string){
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

  refresh(refreshToken:string){return this.supabase.refresh(refreshToken);}
  signOut(accessToken:string){return this.supabase.signOut(accessToken);}
}

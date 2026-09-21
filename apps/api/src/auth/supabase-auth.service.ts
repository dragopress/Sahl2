import {Injectable,InternalServerErrorException,UnauthorizedException} from '@nestjs/common';

type SupabaseUser={id:string;email?:string|null;user_metadata?:Record<string,unknown>|null};
type SupabaseSession={access_token:string;refresh_token:string;expires_in:number;user:SupabaseUser};

@Injectable()
export class SupabaseAuthService{
  private readonly url=String(process.env.SUPABASE_URL||'').replace(/\/$/,'');
  private readonly key=String(process.env.SUPABASE_PUBLISHABLE_KEY||'');

  private ensureConfigured(){
    if(!this.url||!this.key) throw new InternalServerErrorException('Supabase Auth is not configured');
  }

  private async request<T>(path:string,init:RequestInit):Promise<T>{
    this.ensureConfigured();
    const response=await fetch(`${this.url}/auth/v1/${path}`,{
      ...init,
      headers:{
        apikey:this.key,
        ...(init.headers||{}),
      },
    });
    const body=await response.json().catch(()=>({}));
    if(!response.ok){
      const message=typeof body?.msg==='string'?body.msg:typeof body?.message==='string'?body.message:'Supabase Auth request failed';
      if(response.status===400||response.status===401) throw new UnauthorizedException(message);
      throw new InternalServerErrorException(message);
    }
    return body as T;
  }

  async signUp(email:string,password:string,name:string){
    return this.request<SupabaseSession|{user:SupabaseUser;session:null}>('signup',{
      method:'POST',
      headers:{'content-type':'application/json'},
      body:JSON.stringify({email,password,data:{name}}),
    });
  }

  async signIn(email:string,password:string){
    return this.request<SupabaseSession>('token?grant_type=password',{
      method:'POST',
      headers:{'content-type':'application/json'},
      body:JSON.stringify({email,password}),
    });
  }

  async getUser(accessToken:string){
    if(!accessToken) throw new UnauthorizedException('Authentication required');
    return this.request<SupabaseUser>('user',{
      method:'GET',
      headers:{Authorization:`Bearer ${accessToken}`},
    });
  }

  async refresh(refreshToken:string){
    if(!refreshToken) throw new UnauthorizedException('Refresh token required');
    return this.request<SupabaseSession>('token?grant_type=refresh_token',{
      method:'POST',
      headers:{'content-type':'application/json'},
      body:JSON.stringify({refresh_token:refreshToken}),
    });
  }

  async signOut(accessToken:string){
    if(!accessToken)return;
    await fetch(`${this.url}/auth/v1/logout`,{
      method:'POST',
      headers:{apikey:this.key,Authorization:`Bearer ${accessToken}`},
    }).catch(()=>undefined);
  }
}

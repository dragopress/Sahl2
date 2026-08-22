import {CanActivate,ExecutionContext,Injectable,TooManyRequestsException} from '@nestjs/common';

type Bucket={count:number;resetAt:number};

@Injectable()
export class RateLimitGuard implements CanActivate{
  private readonly buckets=new Map<string,Bucket>();
  private lastCleanup=0;

  canActivate(ctx:ExecutionContext){
    const req:any=ctx.switchToHttp().getRequest();
    const path=String((req.baseUrl||'')+(req.path||req.route?.path||''));
    if(path.endsWith('/health')||path.endsWith('/health/live')||path.endsWith('/health/ready')) return true;
    const now=Date.now();
    if(now-this.lastCleanup>60_000){
      for(const [key,bucket] of this.buckets){if(bucket.resetAt<=now)this.buckets.delete(key);}
      this.lastCleanup=now;
    }
    const isAuth=path.includes('/auth/');
    const windowMs=Number(process.env.RATE_LIMIT_WINDOW_MS)||60_000;
    const max=isAuth?(Number(process.env.AUTH_RATE_LIMIT_MAX)||10):(Number(process.env.RATE_LIMIT_MAX)||120);
    const ip=this.clientIp(req);
    const key=`${isAuth?'auth':'api'}:${ip}`;
    const bucket=this.buckets.get(key);
    if(!bucket||bucket.resetAt<=now){
      this.buckets.set(key,{count:1,resetAt:now+windowMs});
      return true;
    }
    if(bucket.count>=max){
      const retryAfter=Math.max(1,Math.ceil((bucket.resetAt-now)/1000));
      req.res?.setHeader('Retry-After',String(retryAfter));
      throw new TooManyRequestsException('Too many requests');
    }
    bucket.count++;
    return true;
  }

  private clientIp(req:any){
    if(process.env.TRUST_PROXY==='true'){
      const forwarded=String(req.headers?.['x-forwarded-for']||'').split(',')[0].trim();
      if(forwarded)return forwarded.slice(0,128);
    }
    return String(req.ip||req.socket?.remoteAddress||'unknown').slice(0,128);
  }
}

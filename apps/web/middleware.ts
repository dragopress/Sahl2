import {NextRequest,NextResponse} from 'next/server';

const API=process.env.API_INTERNAL_URL||process.env.NEXT_PUBLIC_API_URL||'http://127.0.0.1:3001/api/v1';

async function check(request:NextRequest){
  return fetch(`${API.replace(/\/$/,'')}/auth/me`,{
    headers:{cookie:request.headers.get('cookie')||''},
    cache:'no-store',
  });
}

async function refresh(request:NextRequest){
  return fetch(`${API.replace(/\/$/,'')}/auth/refresh`,{
    method:'POST',
    headers:{cookie:request.headers.get('cookie')||''},
    cache:'no-store',
  });
}

export async function middleware(request:NextRequest){
  const {pathname}=request.nextUrl;
  const isPublic=pathname==='/'||pathname==='/login'||pathname==='/register'||pathname.startsWith('/auth')||pathname.startsWith('/_next')||pathname.startsWith('/api');
  if(isPublic)return NextResponse.next();

  let auth=await check(request);
  if(!auth.ok){
    const renewed=await refresh(request);
    if(renewed.ok){
      const response=NextResponse.next();
      const setCookie=renewed.headers.get('set-cookie');
      if(setCookie)response.headers.set('set-cookie',setCookie);
      auth=await check(new NextRequest(request.url,{headers:new Headers({...Object.fromEntries(request.headers),cookie:setCookie?.split(';')[0]||request.headers.get('cookie')||''})}));
      if(auth.ok){
        response.headers.set('Cache-Control','private, no-store');
        return response;
      }
    }
    return NextResponse.redirect(new URL('/login',request.url));
  }

  const response=NextResponse.next();
  response.headers.set('Cache-Control','private, no-store');
  return response;
}

export const config={
  matcher:['/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)'],
};

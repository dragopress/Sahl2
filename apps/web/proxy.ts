import {NextRequest,NextResponse} from 'next/server';

const API=process.env.API_INTERNAL_URL||process.env.NEXT_PUBLIC_API_URL||'http://127.0.0.1:3001/api/v1';

function hasSession(request:NextRequest){
  return Boolean(request.cookies.get('sahlbiz_session')?.value);
}

export async function proxy(request:NextRequest){
  const {pathname}=request.nextUrl;
  const isPublic=pathname==='/'||pathname==='/login'||pathname==='/register'||pathname.startsWith('/auth')||pathname.startsWith('/_next')||pathname.startsWith('/api');
  if(isPublic)return NextResponse.next();

  if(!hasSession(request)){
    return NextResponse.redirect(new URL('/login',request.url));
  }

  const response=NextResponse.next();
  response.headers.set('Cache-Control','private, no-store');

  try{
    const check=await fetch(`${API.replace(/\\/$/,'')}/auth/me`,{
      headers:{cookie:request.headers.get('cookie')||''},
      cache:'no-store',
    });
    if(check.ok)return response;
  }catch{}

  return NextResponse.redirect(new URL('/login',request.url));
}

export const config={
  matcher:['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)'],
};

import {NextRequest,NextResponse} from 'next/server';

const API=process.env.API_INTERNAL_URL||process.env.NEXT_PUBLIC_API_URL||'http://127.0.0.1:3001/api/v1';

async function forward(request:NextRequest,params:Promise<{path:string[]}>){
  const {path}=await params;
  const target=`${API.replace(/\\/$/,'')}/${path.join('/')}${request.nextUrl.search}`;
  const headers=new Headers(request.headers);
  headers.delete('host');
  headers.delete('content-length');

  const body=request.method==='GET'||request.method==='HEAD'?undefined:await request.arrayBuffer();
  return fetch(target,{method:request.method,headers,body,redirect:'manual'});
}

async function handler(request:NextRequest,{params}:{params:Promise<{path:string[]}>}){
  const upstream=await forward(request,params);
  return new NextResponse(upstream.body,{status:upstream.status,statusText:upstream.statusText,headers:upstream.headers});
}

export const GET=handler;
export const POST=handler;
export const PUT=handler;
export const PATCH=handler;
export const DELETE=handler;
export const HEAD=handler;

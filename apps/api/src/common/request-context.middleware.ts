import {randomUUID} from 'node:crypto';

export function requestContextMiddleware(req:any,res:any,next:()=>void){
  const incoming=typeof req.headers?.['x-request-id']==='string'?req.headers['x-request-id'].trim():'';
  const requestId=incoming && incoming.length<=128?incoming:randomUUID();
  req.requestId=requestId;
  res.setHeader('X-Request-Id',requestId);
  const started=process.hrtime.bigint();
  res.on('finish',()=>{
    const durationMs=Number(process.hrtime.bigint()-started)/1_000_000;
    if(process.env.NODE_ENV!=='test') console.info(JSON.stringify({event:'http_request',requestId,method:req.method,path:req.originalUrl,statusCode:res.statusCode,durationMs:Math.round(durationMs),ip:req.ip}));
  });
  next();
}

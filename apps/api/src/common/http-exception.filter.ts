import {ArgumentsHost,Catch,ExceptionFilter,HttpException,HttpStatus} from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter{
  catch(exception:any,host:ArgumentsHost){
    const response=host.switchToHttp().getResponse();
    const request=host.switchToHttp().getRequest();
    const status=exception instanceof HttpException?exception.getStatus():HttpStatus.INTERNAL_SERVER_ERROR;
    const raw=exception instanceof HttpException?exception.getResponse():null;
    const message=typeof raw==='object'&&raw?raw.message:typeof raw==='string'?raw:'Internal server error';
    const payload={statusCode:status,message,requestId:request.requestId,timestamp:new Date().toISOString(),path:request.originalUrl};
    if(status>=500) console.error(JSON.stringify({event:'http_error',requestId:request.requestId,status,error:exception?.message,stack:exception?.stack}));
    response.status(status).json(payload);
  }
}

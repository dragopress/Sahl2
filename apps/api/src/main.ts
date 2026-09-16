import 'reflect-metadata';
import {ValidationPipe} from '@nestjs/common';
import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {HttpExceptionFilter} from './common/http-exception.filter';
import {requestContextMiddleware} from './common/request-context.middleware';
import {securityHeadersMiddleware} from './common/security-headers.middleware';

async function bootstrap(){
  const app=await NestFactory.create(AppModule,{bodyParser:true});
  app.setGlobalPrefix('api/v1');
  app.set('trust proxy',process.env.TRUST_PROXY==='true');
  const origins=String(process.env.CORS_ORIGINS||'http://localhost:3000').split(',').map(v=>v.trim()).filter(Boolean);
  if(process.env.NODE_ENV==='production' && origins.length===0) throw new Error('CORS_ORIGINS must be configured in production');
  app.enableCors({origin:origins,credentials:true,methods:['GET','HEAD','POST','PATCH','PUT','DELETE','OPTIONS'],allowedHeaders:['Content-Type','Authorization','X-Organization-Id','X-Request-Id','Idempotency-Key'],exposedHeaders:['X-Request-Id','Retry-After']});
  app.use(requestContextMiddleware);
  app.use(securityHeadersMiddleware);
  app.useGlobalPipes(new ValidationPipe({whitelist:true,transform:true,forbidUnknownValues:true,forbidNonWhitelisted:true,stopAtFirstError:false}));
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(Number(process.env.PORT)||4000);
}
bootstrap();

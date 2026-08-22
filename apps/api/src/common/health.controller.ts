import {Controller,Get,ServiceUnavailableException} from '@nestjs/common';
import {PrismaService} from './prisma.service';

@Controller('health')
export class HealthController{
  constructor(private readonly prisma:PrismaService){}
  @Get() check(){return {status:'ok',service:'sahlbiz-api',timestamp:new Date().toISOString()};}
  @Get('live') live(){return {status:'ok',timestamp:new Date().toISOString()};}
  @Get('ready') async ready(){
    try{await this.prisma.$queryRaw`SELECT 1`;return {status:'ready',dependencies:{postgres:'ok'},timestamp:new Date().toISOString()};}
    catch{throw new ServiceUnavailableException('Service not ready');}
  }
}

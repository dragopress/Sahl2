import {Controller,Get,UseGuards} from '@nestjs/common';
import {AuthGuard} from '../common/auth.guard';

@Controller('dashboard')
@UseGuards(AuthGuard)
export class DashboardController{
  @Get('summary')
  summary(){return {currency:'MAD',revenue:124850,unpaid:31420,expenses:46280,cash:183420,period:'current'};}
}

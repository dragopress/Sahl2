import {Controller,Get} from '@nestjs/common';
@Controller('dashboard') export class DashboardController{@Get('summary') summary(){return {currency:'MAD',revenue:124850,unpaid:31420,expenses:46280,cash:183420,period:'current'};}}

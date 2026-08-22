import {Module} from '@nestjs/common';
import {PrismaService} from '../common/prisma.service';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
@Module({controllers:[AuthController],providers:[PrismaService,AuthService],exports:[PrismaService,AuthService]}) export class AuthModule{}

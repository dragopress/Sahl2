import {Module} from '@nestjs/common';
import {CommonModule} from '../common/common.module';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {SupabaseAuthService} from './supabase-auth.service';

@Module({
  imports:[CommonModule],
  controllers:[AuthController],
  providers:[AuthService,SupabaseAuthService],
  exports:[AuthService,SupabaseAuthService],
})
export class AuthModule {}

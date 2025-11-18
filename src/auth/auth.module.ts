import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { DatabaseModule } from '../database/database.module';
import { RegisterController } from './register.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [AuthController, RegisterController],
  providers: [AuthService],
})
export class AuthModule {}



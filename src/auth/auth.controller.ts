import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService, User } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('login')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @HttpCode(200)
  async login(@Body() body: LoginDto): Promise<User> {
    return this.authService.login(body);
  }
}



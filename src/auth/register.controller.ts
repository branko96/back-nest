import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService, User } from './auth.service';
import { RegisterDto } from './dto/register.dto';

@Controller('register')
export class RegisterController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @HttpCode(201)
  async register(@Body() body: RegisterDto): Promise<User> {
    return this.authService.register(body);
  }
}



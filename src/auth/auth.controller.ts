import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { login } from './dto/auth.dto';
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() auth: login) {
    return this.authService.login(auth);
  }
}

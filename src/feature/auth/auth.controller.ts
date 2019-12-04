import {
  Controller,
  Get,
  Render,
  Post,
  Body,
  Query,
  UseGuards,
  Logger,
  Req,
  Res,
  All,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Register } from './entity/register.entity';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async register(@Body() register: Register) {
    // return await this.authService.register(register);
  }
}

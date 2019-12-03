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
import { RegisterEntity } from './entity/register.entity';
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async register(@Body() register: RegisterEntity) {
    return await this.authService.register(register);
  }
}

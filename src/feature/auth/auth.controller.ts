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
  /**
   *  提交注册
   * @param register
   */
  @Post('/register')
  async register(@Body() register: Register) {
    return await this.authService.register(register);
  }

  /** 激活账号  TODO:// query和 body*/
  // @Get('/active_account')
  // async activeAccount(@Query() account: AccountDto) {
  //   return await this.authService.activeAccount(account);
  // }
}

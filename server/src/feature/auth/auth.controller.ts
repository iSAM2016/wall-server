import {
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
  Controller,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Register, User } from '../../entity';
import { ApiTags, ApiProperty } from '@nestjs/swagger';
import { SignUpDto, SignInDto } from './dto';
import { AuthService } from './auth.service';
import { ConfigService } from '../../core/configure/config.service';
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}
  /**
   *  提交注册
   * @param register
   */
  @Post('/register')
  async register(@Body() register: Register) {
    return await this.authService.register(register);
  }
  /**
   * 注册
   * @param body
   */

  @ApiProperty()
  @Post('sign-up')
  async signUP(@Body() body: SignUpDto) {
    return await this.authService.signUP(body);
  }
  /**
   *  登录
   * @param body
   * @param req
   */
  @ApiProperty()
  @Post('sign-in')
  async signIn(
    @Body() body: SignInDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    let cookieInfo: any = await this.authService.signIn(body);
    const response = (req.session.authUser = cookieInfo);
    res.cookie('authUser', cookieInfo, {
      maxAge: +this.config.get('MAXAGE_MS'),
      signed: true,
    });

    delete response.password;
    return response;
  }
  /** 激活账号  TODO:// query和 body*/
  // @Get('/active_account')
  // async activeAccount(@Query() account: AccountDto) {
  //   return await this.authService.activeAccount(account);
  // }
}

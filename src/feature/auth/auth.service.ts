import * as utility from 'utility';
import { Repository } from 'typeorm';
import { hashSync, compareSync } from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
// import { ConfigService } from '../../../config/config.service';
import { Register } from './entity/register.entity';
import appConfig from '../../config/app';
import {
  Logger,
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { format } from 'path';

function encryptMD5(key: string): string {
  return utility.md5(key);
}

@Injectable()
export class AuthService {
  constructor() // @InjectRepository(Register)
  // private readonly registoryRepository: Repository<Register>,
  // private readonly config: ConfigService,
  {
    // console.log(this.config.get('SYSTEM_SECRET'));
  }

  // async register(register: Register) {
  //   const { loginname, email, name } = register;
  //   const userExist = await this.registoryRepository.count({ loginname });
  //   console.log(userExist);
  //   console.log(register);
  //   // 返回1存在，0不存在
  //   if (userExist) {
  //     return {
  //       error: '用户名或邮箱已被使用。',
  //       loginname,
  //       email,
  //     };
  //   }

  //   // hash加密密码，不能明文存储到数据库
  //   const passhash = hashSync(register.pass, 10);
  //   // 保存用户到数据库
  //   try {
  //     const user = await this.registoryRepository.save({
  //       loginname,
  //       email,
  //       pass: passhash,
  //       name,
  //     });
  //     console.log(user);
  //     const token = encryptMD5(
  //       email + passhash + this.config.get('SYSTEM_SECRET'),
  //     );
  //     // this.mailService.sendActiveMail(email, token, loginname);
  //     return {
  //       success: `欢迎加入 ${appConfig.name}！我们已给您的注册邮箱发送了一封邮件，请点击里面的链接来激活您的帐号。`,
  //     };
  //   } catch (error) {
  //     throw new InternalServerErrorException(error);
  //   }
  // }

  async findAll() {}
}

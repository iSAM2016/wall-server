import * as utility from 'utility';
import { Repository } from 'typeorm';
import appConfig from '../../config/app';
import { hashSync, compareSync } from 'bcryptjs';
import { MailService } from 'src/shared/services';
import { InjectRepository } from '@nestjs/typeorm';
import { Register } from './entity/register.entity';
import { ConfigService } from '../../core/configure/config.service';
import {
  Logger,
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';

function encryptMD5(key: string): string {
  return utility.md5(key);
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Register)
    private readonly registoryRepository: Repository<Register>,
    private readonly config: ConfigService,
    private readonly mailService: MailService,
  ) {}

  async register(register: Register) {
    const { name } = register;
    const userExist = await this.registoryRepository.count({ name });
    // 返回1存在，0不存在
    if (userExist) {
      return {
        error: '用户名或邮箱已被使用。',
      };
    }

    // hash加密密码，不能明文存储到数据库
    const passhash = hashSync(register.name, 10);
    // 保存用户到数据库
    try {
      const user = await this.registoryRepository.save({
        pass: passhash,
        name,
      });
      const token = encryptMD5(passhash + this.config.get('SYSTEM_SECRET'));
      this.mailService.sendActiveMail('ihailong@outlook.com', token, name);
      return {
        success: `欢迎加入 ${appConfig.name}！我们已给您的注册邮箱发送了一封邮件，请点击里面的链接来激活您的帐号。`,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findAll() {}
}

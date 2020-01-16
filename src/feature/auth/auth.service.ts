import {
  Logger,
  Injectable,
  HttpStatus,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import * as utility from 'utility';
import { Repository } from 'typeorm';
import appConfig from '../../../config/app';
import { SignUpDto, SignInDto } from './dto';
import { MailService } from 'src/shared/services';
import { InjectRepository } from '@nestjs/typeorm';
import { genSalt, hash, hashSync, compare } from 'bcryptjs';
import { Register, Role, User, Profile } from '../../entity';
import { sign } from 'jsonwebtoken';
import { ConfigService } from '../../core/configure/config.service';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
function encryptMD5(key: string): string {
  return utility.md5(key);
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Register)
    private readonly registoryRepository: Repository<Register>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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

    // hash加密密码，不能明文3.存储到数据库
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
  // 注册
  async signUP(body: SignUpDto) {
    const { email, firstName } = body;
    const userRole = await this.userRepository
      .createQueryBuilder('user')
      .where('user.username = :username', { firstName })
      .orWhere('user.email = :email', { email });
    if (userRole) {
      const errors = { username: 'Username and email must be unique.' };
      throw new HttpException(
        { message: 'Input data validation failed', errors },
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = new User();
    user.email = body.email;
    user.password_md5 = await genSalt().then(s => hash(body.password, s));
    // user.role = userRole;

    const profile = new Profile();
    profile.firstName = body.firstName;
    profile.lastName = body.lastName;
    // profile.user = user;
    try {
      this.userRepository.save(user);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
    try {
      this.profileRepository.save(profile);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  // 登录
  async signIn(body: SignInDto): Promise<any> {
    const user: User = await this.userRepository.findOne({
      email: body.email,
      // relations: ['profile', 'role'],
    });
    if (!user) throw new BadRequestException('Email address does not exits');
    const isCorrectPassword = await compare(body.password, user.password_md5);
    if (!isCorrectPassword) {
      throw new BadRequestException('Password is not correct.');
    }
    const accessToken: string = await sign(
      {
        id: user.id,
        email: user.email,
      },
      this.config.get('SYSTEM_SECRET'),
      {
        expiresIn: +this.config.get('MAXAGE_MS'),
        issuer: 'API League Team',
      },
    );
    return {
      ...user,
      accessToken,
    };
  }
}

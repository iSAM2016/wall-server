import {
  Injectable,
  CanActivate,
  ArgumentsHost,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { promisify } from 'util';
import { Observable } from 'rxjs';
import { verify } from 'jsonwebtoken';
import { getRepository } from 'typeorm';
import { Request, Response } from 'express';
import { User } from '../../entity';
import { ConfigService } from '../configure/config.service';

@Injectable()
export class RolesGuard implements CanActivate {
  private errMissingAuthorization = new UnauthorizedException(
    'Authorization Required',
  );
  private errInvalidBearer = new UnauthorizedException(
    'Invalid Authorization Scheme',
  );
  private errInvalidToken = new UnauthorizedException(
    'Invalid Authorization Token',
  );
  // 是否进行校验
  private required: boolean = true;
  /**
   * 检查token 是否合法
   */
  checkBearerLegal(request: Request): string {
    const authorization = request.get('authorization') || '';
    if (this.required && !authorization) {
      throw this.errMissingAuthorization;
    }

    const [bearer, token] = authorization.split(' ');
    if (this.required && bearer.toLowerCase() !== 'bearer') {
      throw this.errInvalidBearer;
    }

    if (this.required && !token) {
      throw this.errInvalidToken;
    }
    return token;
  }
  /**
   * 检查用户是是否存在
   * @param id
   */
  async checkUserExist(jwtDecoded: any): Promise<any> {
    let user: User;
    if (jwtDecoded && jwtDecoded.id) {
      user = await getRepository(User).findOne(
        {
          id: jwtDecoded.id,
        },
        {
          relations: ['profile', 'role'],
        },
      );
    }
    if (user && !user) {
      throw this.errInvalidToken;
    }
    return user;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    let roles: string[] = [];
    const ctx = context.switchToHttp();
    const response: Response = ctx.getResponse<Response>();
    const request: Request = ctx.getRequest<Request>();
    if (request.url === '/auth/sign-in' || request.url === '/auth/sign-up') {
      return true;
    }
    (request as any).userId = 0;
    return true;
    let token: string = this.checkBearerLegal(request);
    const jwtDecoded: any = await promisify(verify)(
      token,
      ConfigService.get('SYSTEM_SECRET'),
    ).catch(e => {
      if (this.required) throw new UnauthorizedException(e.message);
    });

    let user: any = await this.checkUserExist(jwtDecoded);
    // if (user && roles.length) {
    //   const isRoleAllowed = !!roles.find(role => user.role.name === role);
    //   if (!isRoleAllowed) throw new ForbiddenException('Access Denied');
    // }
    (request as any).user = user;
    return true;
  }
}

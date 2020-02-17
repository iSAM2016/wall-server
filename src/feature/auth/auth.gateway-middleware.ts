import { verify } from 'jsonwebtoken';
import { promisify } from 'util';

import { User } from '../../entity';

import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import {
  Injectable,
  CanActivate,
  ArgumentsHost,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

export class AuthGatewayMiddleware {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  resolve() {
    return async (socket: SocketIO.Socket, next: Function): Promise<void> => {
      try {
        const decodedJWT: { id: number; email: string } = await this.verifyJWT(
          socket.handshake.query.accessToken,
        );
        // const user = await this.userRepository.findByEmail(decodedJWT.email);
        // if (!user) return next(new Error('User was not found.'));
        next();
      } catch (error) {
        next(error);
      }
    };
  }

  private async verifyJWT(accessToken: string): Promise<any> {
    return promisify(verify)(accessToken, process.env.SECRET);
  }
}

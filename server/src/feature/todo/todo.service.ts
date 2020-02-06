import {
  Logger,
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';

import * as utility from 'utility';
import { Repository } from 'typeorm';
import { Todo, User } from '../../entity';
import appConfig from '../../../config/app';
import { InjectRepository } from '@nestjs/typeorm';
import { genSalt, hash, hashSync } from 'bcryptjs';
import { MailService } from '../../shared/services';
import { CreateTodoDto } from './dto/createTodo.dto';
import { ConfigService } from '../../core/configure/config.service';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>,
  ) {}

  async create(body: CreateTodoDto, authUser: User) {
    // 返回1存在，0不存在
    const todo = new Todo();
    todo.title = body.title;
    todo.description = body.description;
    // todo.user = authUser;
    await this.todoRepository.save(todo);

    // inform everyone
    if (todo.isPublic) {
      // this.appGateway.io.emit('todoCreated', {
      //   createdBy: authUser.profile.fullName,
      // });
    }
    return todo;
  }
}

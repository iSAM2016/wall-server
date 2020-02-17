import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateTodoDto } from './dto/createTodo.dto';
import { User, Todo } from '@entity';
import { TodoService } from './todo.service';

export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  async create(@Body() body: CreateTodoDto, authUser: User) {
    return await this.todoService.create(body, authUser);
  }
}

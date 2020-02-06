import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  validate,
  validateOrReject,
  Contains,
  IsInt,
  Length,
  IsEmail,
  IsFQDN,
  IsDate,
  IsString,
  IsNotEmpty,
  IsByteLength,
  Matches,
  Min,
  Max,
} from 'class-validator';
import { Todo } from 'src/entity';

export class CreateTodoDto extends Todo {
  @IsNotEmpty({
    message: '标题不能为空',
  })
  @ApiProperty({ required: true })
  title: string;

  @ApiPropertyOptional()
  description?: string;
}

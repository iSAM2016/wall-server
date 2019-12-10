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
  // Transform,
  Matches,
  Min,
  Max,
} from 'class-validator';

export class SignUpDto {
  @IsNotEmpty({
    message: '邮箱不能为空',
  })
  @IsNotEmpty({
    message: '邮箱不能为空',
  })
  @IsEmail(
    {},
    {
      message: '邮箱不合法',
    },
  )
  @ApiProperty()
  email: string;

  @IsNotEmpty({
    message: '密码不能为空',
  })
  @IsByteLength(6, 18, {
    message: '密码长度不是6-18位',
  })
  @ApiProperty()
  password: string;

  // @Matches(/^[a-zA-Z0-9]{5, 20}$/i, {
  //   message: '用户名不合法',
  // })
  @IsNotEmpty({
    message: '用户名不能为空',
  })
  @ApiProperty()
  firstName: string;

  @ApiPropertyOptional()
  lastName?: string;
}

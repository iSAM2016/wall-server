import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class SignInDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}

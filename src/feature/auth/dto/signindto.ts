import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { User } from 'src/entity';
export class SignInDto extends User {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}

// 相当于java 中的pojo
// mapper 是一个接口文件
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
  Min,
  Max,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
export class CreateCatDto {
  @ApiProperty({})
  @IsString()
  readonly name: string;

  @ApiProperty({ type: Number })
  @IsInt()
  readonly age: number;

  @ApiProperty()
  @IsString()
  readonly breed: string;
}

// public abstract class BasePojo {

//   private Date created;
//   private Date updated;
//   public Date getCreated() {
//       return created;
//   }
//   public void setCreated(Date created) {
//       this.created = created;
//   }
//   public Date getUpdated() {
//       return updated;
//   }
//   public void setUpdated(Date updated) {
//       this.updated = updated;
//   }

// }

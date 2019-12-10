import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadGatewayException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toVaildate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    let errorMessage: string = '';
    errors.forEach(_ => {
      Object.keys(_.constraints).forEach(key => {
        errorMessage += _.constraints[key] + ',';
      });
    });
    if (errors.length > 0) {
      throw new BadGatewayException(errorMessage);
    }
    return value;
  }

  private toVaildate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}

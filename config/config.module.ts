import { Module, Global } from '@nestjs/common';
import { ConfigService } from './config.service';
@Module({
  providers: [
    {
      provide: ConfigService,
      useValue: new ConfigService( //参见自定义提供程序
        `${process.env.NODE_ENV || 'development'}.env`,
      ),
    },
  ],
  exports: [ConfigService],
})
export class ConfigModule {}

// 执行顺序：

// 类装饰器总是最后执行。
// 有多个方法参数装饰器时：从最后一个参数依次向前执行。
// 方法参数装饰器中参数装饰器先执行，方法参数装饰器执行完以后，方法装饰器执。
// 方法和属性装饰器，谁在前面谁先执行。（ps：方法参数属于方法一部分，参数会一直紧紧挨着方法执行。）

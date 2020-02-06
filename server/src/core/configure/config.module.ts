import { Module, Global, DynamicModule } from '@nestjs/common';
import { ConfigService } from './config.service';
import { CONFIG_OPTIONS } from './constants';
// 动态模块
@Global()
@Module({})
export class ConfigModule {
  static register(options): DynamicModule {
    return {
      module: ConfigModule,
      //options 对象绑定到 IoC 容,然后让 Nest 将其注入 ConfigService
      providers: [
        {
          provide: CONFIG_OPTIONS,
          useValue: options,
        },
        ConfigService,
      ],
      exports: [ConfigService],
    };
  }
}

// 全局组件 j
// @Global()
// @Module({
//   providers: [
//     {
//       provide: ConfigService,
//       useValue: new ConfigService( //参见自定义提供程序
//         `${process.env.NODE_ENV || 'development'}.env`,
//       ),
//     },
//   ],
//   exports: [ConfigService],
// })
// export class ConfigModule {}

// 执行顺序：
//TODO:
// 类装饰器总是最后执行。
// 有多个方法参数装饰器时：从最后一个参数依次向前执行。
// 方法参数装饰器中参数装饰器先执行，方法参数装饰器执行完以后，方法装饰器执。
// 方法和属性装饰器，谁在前面谁先执行。（ps：方法参数属于方法一部分，参数会一直紧紧挨着方法执行。）

//在自定义提供者一章中，提供者可以包含任何值，而不仅仅是服务，所以我们可以使用依赖项注入来处理简单的 options 对象。

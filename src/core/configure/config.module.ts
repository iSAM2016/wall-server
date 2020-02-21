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

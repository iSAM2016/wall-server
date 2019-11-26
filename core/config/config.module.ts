import { Module, DynamicModule, Global } from '@nestjs/common';
import { ConfigService } from './config.service';
// import { ConfigurationToken } from './config.constants';
import { EnvConfig, ConfigOptions, EnvValidator } from './config.interface';
import { async } from 'rxjs/internal/scheduler/async';
// import { ConfigService } from './config.service';
// 系统配置和应用配置;
// 配置模块
// 创建全局模块，全局模块不需要在注入到该模块，就能使用该模块导出的服务。
// 创建动态模块，动态模块可以创建可定制的模块，动态做依赖注入关系。
@Global()
@Module({})
export class ConfigModule {
  static resolveRootPath(path: string): typeof ConfigModule {
    ConfigService.resolveRootPath(path);
    return this;
  }
  static resolveEnvVakidator(validator: EnvValidator): typeof ConfigModule {
    ConfigService.resolveEnvValidator(validator);
    return this;
  }
  static forRoot(glob: string, options: ConfigOptions): DynamicModule {
    return {
      module: ConfigModule,
      providers: [
        {
          provide: ConfigService,
          useFactory: async (): Promise<ConfigService> =>
            ConfigService.load(glob, options),
        },
      ],
      exports: [ConfigService],
    };
  }
}

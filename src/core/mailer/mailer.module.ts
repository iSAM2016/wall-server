import { DynamicModule, Module, Provider, Global } from '@nestjs/common';
import {
  MailerOptionsFactory,
  MailerModuleInterface,
  MailerModuleAsyncOptions,
} from './mailer.interface';
import { MailerService } from './mailer.server';
import { MAILER_MODULE_OPTIONS } from './mailer.constants';
import { createMailerClient } from './mailer.providers';
@Global()
@Module({})
export class MailerModule implements MailerModuleInterface {
  /**
   * 同步引导邮箱模块
   *
   */
  static forRoo<T>(options: T): DynamicModule {
    return {
      module: MailerModule,
      providers: [
        { provide: MAILER_MODULE_OPTIONS, useValue: options },
        createMailerClient<T>(),
        MailerService,
      ],
      exports: [MailerService],
    };
  }
  /**
   * 异步引导邮箱模块
   * @param options
   */
  static forRootAsync<T>(options: MailerModuleAsyncOptions<T>): DynamicModule {
    return {
      module: MailerModule,
      imports: options.imports || [],
      providers: [
        ...this.createAsyncProviders(options),
        createMailerClient<T>(),
        MailerService,
      ],
      exports: [MailerService],
    };
  }

  /**
   *根据给定的模块选项返回异步提供程序
   * @param options
   */
  private static createAsyncProviders<T>(
    options: MailerModuleAsyncOptions<T>,
  ): Provider[] {
    if (options.useFactory) {
      return [this.createAsyncOptionsProviders<T>(options)];
    }
  }
  /**
   *  根据给定的模块选项返回异步邮箱选项提供程序
   * @param options fe
   */

  private static createAsyncOptionsProviders<T>(
    options: MailerModuleAsyncOptions<T>,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: MAILER_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    return {
      provide: MAILER_MODULE_OPTIONS,
      useFactory: async (optionsFactory: MailerOptionsFactory<T>) =>
        await optionsFactory.createMailerOptions(),
    };
  }
}

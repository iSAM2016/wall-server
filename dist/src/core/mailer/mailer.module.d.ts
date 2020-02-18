import { DynamicModule } from '@nestjs/common';
import { MailerModuleInterface, MailerModuleAsyncOptions } from './mailer.interface';
export declare class MailerModule implements MailerModuleInterface {
    static forRoo<T>(options: T): DynamicModule;
    static forRootAsync<T>(options: MailerModuleAsyncOptions<T>): DynamicModule;
    private static createAsyncProviders;
    private static createAsyncOptionsProviders;
}

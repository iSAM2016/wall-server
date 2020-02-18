import { DynamicModule, Type } from '@nestjs/common';
import { ModuleMetadata } from '@nestjs/common/interfaces';
import * as JSONTransport from 'nodemailer/lib/json-transport';
import * as SendmailTransport from 'nodemailer/lib/sendmail-transport';
import * as SESTransport from 'nodemailer/lib/ses-transport';
import * as SMTPPool from 'nodemailer/lib/smtp-pool';
import * as SMTPTransport from 'nodemailer/lib/smtp-transport';
import * as StreamTransport from 'nodemailer/lib/stream-transport';
export { TransportOptions } from 'nodemailer';
export interface SendmailTransportOptions extends SendmailTransport.Options {
}
export interface JSONTransportOptions extends JSONTransport.Options {
}
export interface SESTransportOptions extends SESTransport.Options {
}
export interface SMTPTransportOptions extends SMTPTransport.Options {
}
export interface SMTPPoolOptions extends SMTPPool.Options {
}
export interface StreamTransportOptions extends StreamTransport.Options {
}
export interface MailerOptionsFactory<T> {
    createMailerOptions(): Promise<T> | T;
}
export interface MailerModuleAsyncOptions<T> extends Pick<ModuleMetadata, 'imports'> {
    name?: string;
    useClass?: Type<T>;
    useFactory?: (...args: any[]) => Promise<T> | T;
    inject?: any[];
}
export interface MailerConstructor {
    new (): MailerModuleInterface;
    forRoot<T>(options?: MailerOptionsFactory<T>): DynamicModule;
    forRootAsync<T>(options?: MailerModuleAsyncOptions<T>): DynamicModule;
}
export interface MailerModuleInterface {
}

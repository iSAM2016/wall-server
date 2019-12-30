//TODO:: 动态可配置模块，而且还是全局模块，只需要导入一次即可。
// // 同步配置可以是直接填写，异步配置可以是依赖其他模块

import { DynamicModule, Type } from '@nestjs/common';
import { ModuleMetadata } from '@nestjs/common/interfaces';

import * as JSONTransport from 'nodemailer/lib/json-transport';
import * as SendmailTransport from 'nodemailer/lib/sendmail-transport';
import * as SESTransport from 'nodemailer/lib/ses-transport';
import * as SMTPPool from 'nodemailer/lib/smtp-pool';
import * as SMTPTransport from 'nodemailer/lib/smtp-transport';
import * as StreamTransport from 'nodemailer/lib/stream-transport';

export { TransportOptions } from 'nodemailer';
export interface SendmailTransportOptions extends SendmailTransport.Options {}
export interface JSONTransportOptions extends JSONTransport.Options {}
export interface SESTransportOptions extends SESTransport.Options {}
export interface SMTPTransportOptions extends SMTPTransport.Options {}
export interface SMTPPoolOptions extends SMTPPool.Options {}
export interface StreamTransportOptions extends StreamTransport.Options {}

export interface MailerOptionsFactory<T> {
  createMailerOptions(): Promise<T> | T;
}

export interface MailerModuleAsyncOptions<T>
  extends Pick<ModuleMetadata, 'imports'> {
  name?: string; // 模块名称
  useClass?: Type<T>; //应该用于提供MailerOptions的类
  useFactory?: (...args: any[]) => Promise<T> | T; //工厂应该用来提供MailerOptions
  inject?: any[]; //应该注入的提供者
}

// mailerModuler类的interface
export interface MailerConstructor {
  new (): MailerModuleInterface;
  forRoot<T>(options?: MailerOptionsFactory<T>): DynamicModule;
  forRootAsync<T>(options?: MailerModuleAsyncOptions<T>): DynamicModule;
}
export interface MailerModuleInterface {}

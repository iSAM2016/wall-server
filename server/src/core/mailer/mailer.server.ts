import {
  Logger,
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
  Inject,
} from '@nestjs/common';
import { format } from 'path';
import { from, Observable } from 'rxjs';
import * as Mail from 'nodemailer/lib/mailer';
import { MAILER_TOKEN } from './mailer.constants';
import { tap, retryWhen, scan, delay } from 'rxjs/operators';
import { Options as MailMessageOptions } from 'nodemailer/lib/mailer';
@Injectable()
export class MailerService {
  constructor(@Inject(MAILER_TOKEN) private readonly mailer: Mail) {}
  // 注册插件
  use(name: string, pluginFunc: (...args) => any): ThisType<MailerService> {
    this.mailer.use(name, pluginFunc);
    return this;
  }
  //设置配置
  set(key: string, handler: (...arg) => any): ThisType<MailerService> {
    this.mailer.set(key, handler);
    return this;
  }
  //发送邮件配置
  async send(mailMessage: MailMessageOptions): Promise<any> {
    return await from(this.mailer.sendMail(mailMessage)).pipe(
      handleRetry(),
      tap(() => {
        this.mailer.close();
      }),
    );
  }

  async findAll() {}
}

export function handleRetry(
  retryAttempts = 5,
  retryDelay = 3000,
): <T>(source: Observable<T>) => Observable<T> {
  return <T>(source: Observable<T>) =>
    source.pipe(
      retryWhen(e =>
        e.pipe(
          scan((errorCount, error) => {
            // logger.error(
            //   `Unable to connect to the database. Retrying (${errorCount +
            //     1})...`,
            // );
            if (errorCount + 1 >= retryAttempts) {
              // logger.error('send mail finally error', JSON.stringify(error));
              throw error;
            }
            return errorCount + 1;
          }, 0),
          delay(retryDelay),
        ),
      ),
    );
}

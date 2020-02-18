import { Observable } from 'rxjs';
import * as Mail from 'nodemailer/lib/mailer';
import { Options as MailMessageOptions } from 'nodemailer/lib/mailer';
export declare class MailerService {
    private readonly mailer;
    constructor(mailer: Mail);
    use(name: string, pluginFunc: (...args: any[]) => any): ThisType<MailerService>;
    set(key: string, handler: (...arg: any[]) => any): ThisType<MailerService>;
    send(mailMessage: MailMessageOptions): Promise<any>;
    findAll(): Promise<void>;
}
export declare function handleRetry(retryAttempts?: number, retryDelay?: number): <T>(source: Observable<T>) => Observable<T>;

import { MailerService } from 'src/core/mailer/mailer.server';
import { ConfigService } from '../../core/configure/config.service';
export declare class MailService {
    private readonly mailer;
    private readonly configService;
    private readonly from;
    private readonly name;
    private readonly host;
    constructor(mailer: MailerService, configService: ConfigService);
    sendActiveMail(to: string, token: string, username: string): void;
}

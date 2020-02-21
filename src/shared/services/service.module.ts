import { Module } from '@nestjs/common';
import { MailService } from './mail.services';
import { AlertService } from './alert.service';

@Module({
  imports: [],
  providers: [MailService, AlertService],
  exports: [MailService, AlertService],
})
export class ServicesModule {}

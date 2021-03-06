import { Injectable } from '@nestjs/common';
import { MailerService } from 'src/core/mailer/mailer.server';
import { ConfigService } from '@core';
import { Glob } from 'glob';

@Injectable()
export class MailService {
  private readonly from: string;
  private readonly name: string;
  private readonly host: string;

  constructor(
    private readonly mailer: MailerService,

    private readonly configService: ConfigService,
  ) {
    this.name = 'CNode技术社区';
    this.host = `${this.configService.get('HOST')}:${this.configService.get(
      'PORT',
    )}`;
    this.from = `${this.name} <${this.configService.get('MAIL_USER')}>`;
  }
  /**
   *  发送邮件
   * @param to
   * @param token
   * @param username
   */
  sendActiveMail(to: string, token: string, username: string) {
    const name = this.name;
    const subject = `${name}帐号激活`;
    const html = `<p>您好：${username}</p>
    <p>我们收到您在${name}的注册信息，请点击下面的链接来激活帐户：</p>
    <a href="${this.host}/active_account?key=${token}&name=${username}">激活链接</a>
    <p>若您没有在${name}填写过注册信息，说明有人滥用了您的电子邮箱，请删除此邮件，我们对给您造成的打扰感到抱歉。</p>
    <p>${name} 谨上。</p>`;
    this.mailer.send({
      from: this.from,
      to,
      subject,
      html,
    });
  }
}

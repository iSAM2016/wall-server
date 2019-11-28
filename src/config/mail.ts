export interface MailConfig {
  host: string;
  port: number;
  secure: boolean;
  secureConnection: boolean; // 安全连接
  auth: {
    // 邮箱账号
    user: string;
    // 授权码
    pass: string;
  };
  ignoreTLS: boolean;
}

export default {
  host: '{{env.MAIL_HOST}}',
  port: '{{env.MAIL_PORT}}',
  secure: true,
  secureConnection: true,
  auth: {
    user: '{{env.MAIL_USER}}',
    pass: '{{env.MAIL_PASS}}',
  },
  ignoreTLS: true,
};

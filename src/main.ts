import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '../config';
import ExpressConfig from './config/express';
import { RedisConfig } from './config/redis';

import * as cookieParser from 'cookie-parser';
import * as expressSession from 'express-session';
import * as connectRedis from 'connect-redis';
import * as csurf from 'csurf';
import { format } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 防止跨站请求伪造
  app.use(csurf({ cookie: true }));
  const RedisStore = connectRedis(expressSession);
  const secret = ExpressConfig.secret;
  // 注册session中间件
  app.use(
    expressSession({
      name: 'isam216',
      secret, // 用来对sessionid 相关的 cookie 进行签名
      store: new RedisStore({
        // 本地存储session（文本文件，也可以选择其他store，比如redis的）
        host: ConfigService.get('REDIS_HOST'),
        port: +ConfigService.get('REDIS_PORT') || 6379,
        password: '' || undefined,
        db: ConfigService.get('REDIS_DB'),
      }), // 本地存储session（文本文件，也可以选择其他store，比如redis的）
      saveUninitialized: false, // 是否自动保存未初始化的会话，建议false
      resave: false, // 是否每次都重新保存会话，建议false
    }),
  );
  // 注册cookies中间件
  app.use(cookieParser(secret));
  // 防止跨站请求伪造
  app.use(csurf({ cookie: true }));

  await app.listen(3000);
}
bootstrap();

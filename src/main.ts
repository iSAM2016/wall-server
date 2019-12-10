import { format } from 'path';
import * as csurf from 'csurf';
import * as redis from 'redis';
import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import * as session from 'express-session';
import * as connectRedis from 'connect-redis';
import * as cookieParser from 'cookie-parser';
import { WsAdapter } from '@nestjs/platform-ws';
import { ConfigService } from './core/configure/config.service';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpExceptionFilter, RolesGuard } from './core/';
import { ValidationPipe } from './core/pipes/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const secret = ConfigService.get('SYSTEM_SECRET');
  let RedisStore = connectRedis(session);

  //  注册session中间件
  app.use(
    session({
      name: 'isam216',
      secret: String(secret), // 用来对sessionid 相关的 cookie 进行签名
      // 本地存储session（文本文件，也可以选择其他store，比如redis的
      store: new RedisStore({
        client: redis.createClient({
          // 本地存储session（文本文件，也可以选择其他store，比如redis的）
          host: String(ConfigService.get('REDIS_HOST')),
          port: +ConfigService.get('REDIS_PORT') || 6379,
          password: '' || undefined,
          db: ConfigService.get('REDIS_DB'),
        }),
      }),
      resave: false,
      saveUninitialized: false, // 是否自动保存未初始化的会话，建议false
      cookie: {
        maxAge: 24 * 3600 * 1000, // 秒
      },
    }),
  );
  // ws
  app.useWebSocketAdapter(new WsAdapter(app));
  // 注册cookies中间件
  app.use(cookieParser(secret));

  // 防止跨站请求伪造
  // app.use(csurf({ cookie: true }));

  // 注册并配置全局验证管道
  app.useGlobalFilters(new HttpExceptionFilter());

  // 守卫 校验用户身份
  app.useGlobalGuards(new RolesGuard());

  // 注册并配置全局验证管道
  //  ValidationPipe
  app.useGlobalPipes(new ValidationPipe());
  // SwaggerModule
  const options = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();

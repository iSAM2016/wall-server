import { Module } from '@nestjs/common';
// 引入共享模块 访问user数据库
// import { SharedModule } from 'shared';
// 引入控制和服务进行在模块注册
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  //   imports: [SharedModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}

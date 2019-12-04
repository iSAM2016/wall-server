import { Module } from '@nestjs/common';
// 引入共享模块 访问user数据库
// import { SharedModule } from 'shared';
// 引入控制和服务进行在模块注册
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { Register } from './entity/register.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Register])],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}

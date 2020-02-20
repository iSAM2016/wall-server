import { Module } from '@nestjs/common';
import { MysqlModule } from './mysql/mysql.module';
import { ServicesModule } from './services/service.module';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [MysqlModule, ServicesModule, LoggerModule],
  exports: [MysqlModule, ServicesModule, LoggerModule],
})
export class SharedModule {}

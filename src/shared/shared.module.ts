import { Module, Global } from '@nestjs/common';
import { MysqlModule } from './mysql/mysql.module';
import { ServicesModule } from './services/service.module';
import { LoggerModule } from './logger/logger.module';

@Global()
@Module({
  imports: [MysqlModule, ServicesModule, LoggerModule],
  exports: [MysqlModule, ServicesModule, LoggerModule],
})
export class SharedModule {}

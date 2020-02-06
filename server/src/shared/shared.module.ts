import { Module } from '@nestjs/common';
import { MysqlModule } from './mysql/mysql.module';
import { ServicesModule } from './services/service.module';

@Module({
  imports: [MysqlModule, ServicesModule],
  exports: [MysqlModule, ServicesModule],
})
export class SharedModule {}

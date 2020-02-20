import { Module } from '@nestjs/common';
import { LoggerService } from './logger.service';

@Module({
  imports: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}

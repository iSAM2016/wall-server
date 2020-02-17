import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

@Module({
  exports: [CatsService],
  providers: [CatsService],
  controllers: [CatsController],
})
export class CatsModule {}

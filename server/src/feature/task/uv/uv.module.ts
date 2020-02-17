import { TRUvRecord } from '@entity';
import { Module } from '@nestjs/common';
import { UvService } from './uv.service';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [TypeOrmModule.forFeature([TRUvRecord])],
  exports: [UvService],
  providers: [UvService],
})
export class UvModule {}

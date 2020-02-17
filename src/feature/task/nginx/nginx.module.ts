import { Module } from '@nestjs/common';
import { NginxService } from './nginx.service';
import { TRProject } from '@entity';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [TypeOrmModule.forFeature([TRProject])],
  exports: [NginxService],
  providers: [NginxService],
})
export class NginxModule {}

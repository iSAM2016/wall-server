import { Module } from '@nestjs/common';
import { NginxService } from './nginx.service';
import { ProjectModule } from '../shard/project/project.module';
@Module({
  imports: [ProjectModule],
  exports: [NginxService],
  providers: [NginxService],
})
export class NginxModule {}

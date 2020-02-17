import { Module } from '@nestjs/common';
import { NginxModule } from './nginx/nginx.module';
import { UvModule } from './uv/uv.module';
import { DeviceModule } from './device/device.module';

@Module({
  imports: [NginxModule, UvModule, DeviceModule],
  exports: [NginxModule, UvModule, DeviceModule],
})
export class TaskModule {}

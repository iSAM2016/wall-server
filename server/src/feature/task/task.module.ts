import { Module } from '@nestjs/common';
import { NginxModule } from './nginx/nginx.module';
import { UvModule } from './uv/uv.module';
import { DeviceModule } from './device/device.module';
import { MenuClickModule } from './menu_click/menu_click.module';

@Module({
  imports: [NginxModule, UvModule, DeviceModule, MenuClickModule],
  exports: [NginxModule, UvModule, DeviceModule, MenuClickModule],
})
export class TaskModule {}

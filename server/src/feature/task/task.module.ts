import { Module } from '@nestjs/common';
import { NginxModule } from './nginx/nginx.module';
import { UvModule } from './uv/uv.module';
import { DeviceModule } from './device/device.module';
import { MenuClickModule } from './menu_click/menu_click.module';
import { TimeOnSiteModule } from './time_on_site/time_on_site.module';

@Module({
  imports: [
    NginxModule,
    UvModule,
    DeviceModule,
    MenuClickModule,
    TimeOnSiteModule,
  ],
  exports: [
    NginxModule,
    UvModule,
    DeviceModule,
    MenuClickModule,
    TimeOnSiteModule,
  ],
})
export class TaskModule {}

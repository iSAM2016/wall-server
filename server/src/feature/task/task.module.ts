import { Module } from '@nestjs/common';
import { NginxModule } from './nginx/nginx.module';
import { UvModule } from './uv/uv.module';
import { DeviceModule } from './device/device.module';
import { MenuClickModule } from './menu_click/menu_click.module';
import { TimeOnSiteModule } from './time_on_site/time_on_site.module';
import { UserFirstLoginAtModule } from './user_first_login_at/user_first_login_at.module';

@Module({
  imports: [
    NginxModule,
    UvModule,
    DeviceModule,
    MenuClickModule,
    TimeOnSiteModule,
    UserFirstLoginAtModule,
  ],
  exports: [
    NginxModule,
    UvModule,
    DeviceModule,
    MenuClickModule,
    TimeOnSiteModule,
    UserFirstLoginAtModule,
  ],
})
export class TaskModule {}

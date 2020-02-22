import { Module } from '@nestjs/common';
import { NginxModule } from './nginx/nginx.module';
import { UvModule } from './uv/uv.module';
import { DeviceModule } from './device/device.module';
import { MenuClickModule } from './menu_click/menu_click.module';
import { TimeOnSiteModule } from './time_on_site/time_on_site.module';
import { UserFirstLoginAtModule } from './user_first_login_at/user_first_login_at.module';
import { SummaryUvModule } from './summary/uv/summaryUv.module';
import { SummaryTimeOnSiteModule } from './summary/time_on_site/time_on_site.module';
@Module({
  imports: [
    /*** 日志收集模块 */
    NginxModule,
    UvModule,
    DeviceModule,
    MenuClickModule,
    TimeOnSiteModule,
    UserFirstLoginAtModule,
    /*** 统计模块 */
    SummaryUvModule,
    SummaryTimeOnSiteModule,
  ],
  exports: [
    NginxModule,
    UvModule,
    DeviceModule,
    MenuClickModule,
    TimeOnSiteModule,
    UserFirstLoginAtModule,
    SummaryUvModule,
    SummaryTimeOnSiteModule,
  ],
})
export class TaskModule {}

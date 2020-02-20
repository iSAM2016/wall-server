import { Module } from '@nestjs/common';
import { NginxModule } from './nginx/nginx.module';
import { UvModule } from './uv/uv.module';
import { DeviceModule } from './device/device.module';
import { MenuClickModule } from './menu_click/menu_click.module';
import { TimeOnSiteModule } from './time_on_site/time_on_site.module';
import { SummaryUvModule } from './summary_uv/summaryUv.module';
import { UserFirstLoginAtModule } from './user_first_login_at/user_first_login_at.module';
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
  ],
  exports: [
    NginxModule,
    UvModule,
    DeviceModule,
    MenuClickModule,
    TimeOnSiteModule,
    UserFirstLoginAtModule,
    SummaryUvModule,
  ],
})
export class TaskModule {}

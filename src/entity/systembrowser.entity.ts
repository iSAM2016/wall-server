import { Column, Entity, OneToOne } from 'typeorm';

// 浏览器 记录表
import Normal from './normal.entity';
@Entity('systembrowser')
export class SystemBrowser extends Normal {
  @Column({ length: 20, default: '' })
  browser: string; //

  @Column({ length: 50, default: '' })
  browser_version: string; //

  @Column({ length: 10, default: '' })
  count_at_month: string;
}

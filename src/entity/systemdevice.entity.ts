import { Column, Entity, OneToOne } from 'typeorm';

// 设备分布图
import Base from './base.entity';
@Entity('system_device')
export class SystemDevice extends Base {
  @Column({ length: 50, default: '' })
  device_vendor: string;

  @Column({ length: 50, default: '' })
  device_model: string; // 停留的时间

  @Column({ length: 15, default: '' })
  count_at_month: string; //
}

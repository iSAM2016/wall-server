import { Column, Entity, OneToOne } from 'typeorm';

// 用户行为
import Base from './base.entity';
@Entity('alarm_config')
export class AlarmConfig extends Base {
  // 项目id
  // 项目id
  @Column({ type: 'bigint', width: 20, default: 0 })
  project_id: number;

  @Column({ length: 20, default: '' })
  owner_ucid: string; // 停留的时间

  @Column({ length: 20, default: '' })
  error_type: string; //

  @Column({ length: 255, default: '' })
  error_name: string; //

  @Column({ width: 20, default: 0 })
  time_range_s: number; //

  @Column({ width: 20, default: 0 })
  max_error_count: number; //

  @Column({ type: 'bigint', width: 20, default: 0 })
  alarm_interval_s: number;

  @Column({ type: 'tinyint', width: 1, default: 1 })
  is_enable: number;

  @Column({ length: 255, default: '' })
  note: string;

  @Column({ type: 'tinyint', width: 1, default: 0 })
  is_delete: number;

  @Column({ length: 20, default: '' })
  create_ucid: string;

  @Column({ length: 20, default: '' })
  update_ucid: string;
}

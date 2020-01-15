import {
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  PrimaryColumn,
} from 'typeorm';

import Base from './base.entity';
@Entity('duration_distribution')
export class DurationDistribution extends Base {
  @PrimaryGeneratedColumn()
  @PrimaryColumn({ unsigned: true, width: 20, type: 'bigint' })
  id: number;

  @Column({ type: 'bigint', width: 20, default: 0 })
  total_stay_ms: number; // 停留的时间

  // 项目id
  @Column({ type: 'bigint', width: 20, default: 0 })
  project_id: number;

  @Column({ width: 10, default: 0 })
  total_uv: number; // 停留的时间

  @Column({ length: 30, default: '' })
  count_at_time: string; //

  @Column({ length: 20, default: 'day' })
  count_type: string;

  @Column({ type: 'bigint', width: 20 })
  city_distribute_id: number;
}

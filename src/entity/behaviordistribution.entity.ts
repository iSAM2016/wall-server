import {
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  PrimaryColumn,
} from 'typeorm';

import Base from './base.entity';
@Entity('behavior_distribution')
export class BehaviorDistribution extends Base {
  @PrimaryGeneratedColumn()
  @PrimaryColumn({ unsigned: true, width: 20, type: 'bigint' })
  id: number;
  // 项目id
  @Column({ type: 'bigint', width: 20, default: 0 })
  project_id: number;

  @Column({ length: 50, default: '' })
  code: string; // 停留的时间

  @Column({ length: 50, default: '' })
  name: string; //

  @Column({ length: 200, default: '' })
  url: string; //

  @Column({ width: 10, default: 0 })
  total_count: number; //

  @Column({ length: 30, default: '' })
  count_at_time: string; //

  @Column({ length: 20, default: 'day' })
  count_type: string;

  @Column({ type: 'bigint', width: 20 })
  city_distribute_id: number;
}

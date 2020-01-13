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
  @PrimaryColumn()
  @PrimaryGeneratedColumn()
  id: number;
  // 项目id
  @Column({})
  project_id: number;

  @Column({})
  total_stay_ms: number; // 停留的时间

  @Column({})
  total_uv: number; //

  @Column({})
  count_at_time: number;

  @Column({ default: '' })
  count_type: string;

  @Column({})
  city_distribute_id: string;
}

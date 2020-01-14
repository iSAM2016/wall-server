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
  @PrimaryColumn()
  @PrimaryGeneratedColumn()
  id: number;
  // 项目id
  @Column({})
  project_id: number;

  @Column({})
  code: number; // 停留的时间

  @Column({})
  name: number; //

  @Column({})
  total_count: number; //

  @Column({})
  count_at_time: number; //

  @Column({})
  url: string;

  @Column({ default: '' })
  count_type: string;

  @Column({})
  city_distribute_id: string;
}

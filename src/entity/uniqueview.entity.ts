import { Column, Entity, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';

import Base from './base.entity';
//uv记录表, 不分表

@Entity('unique_view')
export class UniqueView extends Base {
  @PrimaryGeneratedColumn()
  @PrimaryColumn({ unsigned: true, width: 20, type: 'bigint' })
  id: number;

  // 项目id
  @Column({ type: 'bigint', width: 20, default: 0 })
  project_id: number;

  @Column({ width: 10, default: 0 })
  total_count: number; //

  @Column({ length: 30, default: '' })
  count_at_time: string; //

  @Column({ length: 20, default: 'day' })
  count_type: string;

  @Column({ type: 'bigint', width: 20 })
  city_distribute_id: number;
}

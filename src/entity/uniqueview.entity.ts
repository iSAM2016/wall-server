import { Column, Entity, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';

import Base from './base.entity';

@Entity('unique_view')
export class UniqueView extends Base {
  @PrimaryColumn()
  @PrimaryGeneratedColumn()
  id: number;

  @Column({})
  project_id: number; // 项目id

  @Column({})
  total_count: number; // 停留的时间

  @Column({})
  count_at_time: number;

  @Column({ default: '' })
  count_type: string;

  @Column({})
  city_distribute_id: string;
}

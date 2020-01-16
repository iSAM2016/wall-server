import { Column, Entity, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';

import Normal from './normal.entity';
//uv记录表, 不分表

@Entity('unique_view')
export class UniqueView extends Normal {
  @Column({ length: 30, default: '' })
  count_at_time: string; //

  @Column({ length: 20, default: 'day' })
  count_type: string;
}

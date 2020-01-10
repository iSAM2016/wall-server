import {
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  PrimaryColumn,
} from 'typeorm';

import Base from './base.entity';

@Entity('uv')
export class UV extends Base {
  @PrimaryColumn()
  @PrimaryGeneratedColumn()
  id: number;

  @Column({})
  uuid: string;

  @Column()
  country: number;

  @Column({ default: '' })
  province: string;

  @Column({ default: '' })
  city: string;

  @Column('int')
  visit_at_hour: number;

  @Column('int')
  pv_count: number;

  @Column({ type: 'tinyint' })
  is_delete: number;
}

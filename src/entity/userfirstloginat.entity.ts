import {
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  PrimaryColumn,
} from 'typeorm';

import Base from './base.entity';
@Entity('userfirstloginat')
export class UserFirstLoginAt extends Base {
  @PrimaryGeneratedColumn()
  @PrimaryColumn({ unsigned: true, width: 20, type: 'bigint' })
  id: number;

  // 项目id
  @Column({ length: 20, default: '' })
  ucid: string;

  @Column({ type: 'bigint', default: 0, width: 20 })
  first_visit_at: number; // 停留的时间

  @Column({ length: 10, default: '' })
  country: string; //

  @Column({ length: 15, default: '' })
  province: string;

  @Column({ length: 15, default: '' })
  city: string;
}

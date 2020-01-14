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
  @PrimaryColumn()
  @PrimaryGeneratedColumn()
  id: number;
  // 项目id
  @Column({})
  ucid: number;

  @Column({})
  first_visit_at: number; // 停留的时间

  @Column({})
  country: number; //

  @Column({})
  province: number;

  @Column({ default: '' })
  city: string;
}

import { Column, Entity, OneToOne } from 'typeorm';

//pv 记录表
import Normal from './normal.entity';
@Entity('systemos')
export class SystemOs extends Normal {
  @Column({ length: 50, default: '' })
  os: string; //

  @Column({ length: 50, default: '' })
  os_version: string;

  @Column({ length: 15, default: '' })
  count_at_month: string;
}

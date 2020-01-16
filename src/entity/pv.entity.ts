import { Column, Entity, OneToOne } from 'typeorm';

//pv 记录表
import Normal from './normal.entity';
@Entity('pv')
export class PV extends Normal {
  @Column({ length: 30, default: '' })
  count_at_time: string; //

  @Column({ length: 20, default: 'day' })
  count_type: string;
}

import { Column, Entity, OneToOne } from 'typeorm';

//新用户统计表
import Normal from './normal.entity';
@Entity('new_user_summary')
export class NewUserSummary extends Normal {
  @Column({ length: 20, default: '' })
  count_at_time: string;

  @Column({ length: 20, default: 'day' })
  count_type: string;
}

import { Column, Entity, OneToOne } from 'typeorm';

// 用户行为
import Normal from './normal.entity';
@Entity('behavior_distribution')
export class BehaviorDistribution extends Normal {
  // 项目id

  @Column({ length: 50, default: '' })
  code: string; // 停留的时间

  @Column({ length: 50, default: '' })
  name: string; //

  @Column({ length: 200, default: '' })
  url: string; //

  @Column({ length: 30, default: '' })
  count_at_time: string; //

  @Column({ length: 20, default: 'day' })
  count_type: string;
}

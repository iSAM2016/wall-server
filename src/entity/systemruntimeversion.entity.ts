import { Column, Entity, OneToOne } from 'typeorm';

// 版本分布
import Base from './base.entity';
@Entity('SystemRuntimeVersion')
export class SystemRuntimeVersion extends Base {
  @Column({ length: 50, default: 0 })
  runtime_version: string; // 停留的时间

  @Column({ length: 15, default: '' })
  count_at_month: string; //
}

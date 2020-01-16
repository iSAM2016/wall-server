import { Column, Entity, OneToOne } from 'typeorm';

// 公共字段
import Base from './base.entity';
export default class Normal extends Base {
  // 项目id
  @Column({ type: 'bigint', width: 20, default: 0 })
  project_id: number;

  @Column({ width: 10, default: 0 })
  total_count: number; //

  @Column({ type: 'bigint', width: 20, default: 0 })
  city_distribute_id: number;
}

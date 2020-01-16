import { Column, Entity, OneToOne } from 'typeorm';

import Base from './base.entity';
@Entity('UVRecode')
export class UVRecode extends Base {
  @Column({ length: 50, default: '' })
  uuid: string;

  @Column({ length: 10, default: '' })
  country: string; //

  @Column({ length: 15, default: '' })
  province: string;

  @Column({ length: 15, default: '' })
  city: string;

  @Column({ length: 20, default: '' })
  visit_at_hour: string;

  @Column({ width: 10, default: 0 })
  pv_count: number;

  //   @Column({ type: 'tinyint' })
  //   is_delete: number;
}

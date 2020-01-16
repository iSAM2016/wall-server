import { Column, Entity, OneToOne } from 'typeorm';

import Base from './base.entity';

@Entity('project')
export class Project extends Base {
  // 项目id
  @Column({ length: 50, default: '' })
  display_name: string;

  @Column({ length: 50, default: '' })
  project_name: string; // 停留的时间

  @Column({ length: 50, default: '' })
  c_desc: string; //

  @Column({ default: 10000, width: 10 })
  rate: number; //

  @Column({ type: 'tinyint', default: 0, width: 1 })
  is_delete: number; //

  @Column({ length: 20, default: '' })
  create_ucid: string;

  @Column({ length: 20, default: '' })
  update_ucid: string;
}

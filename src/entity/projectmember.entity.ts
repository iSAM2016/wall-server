import { Column, Entity, OneToOne } from 'typeorm';

import Base from './base.entity';

@Entity('projectmember')
export class ProjectMember extends Base {
  // 项目id
  @Column({ type: 'bigint', width: 20, default: 0 })
  project_id: number;

  @Column({ length: 20, default: '' })
  ucid: string;

  @Column({ length: 20, default: 'dev' })
  role: string;

  @Column({ type: 'tinyint', default: 0, width: 0 })
  need_alarm: number; //

  @Column({ type: 'tinyint', default: 0, width: 0 })
  is_delete: number; //

  @Column({ length: 20, default: '' })
  create_ucid: string;

  @Column({ length: 20, default: '' })
  update_ucid: string;
}

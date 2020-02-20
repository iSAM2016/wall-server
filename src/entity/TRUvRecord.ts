import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

// @Index('uniq_visit_at_hour_uuid', ['visitAtHour', 'uuid'], { unique: true })
@Entity('t_r_uv_record', { schema: 'nest' })
export class TRUvRecord {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id', unsigned: true })
  id: string;

  @Column('varchar', { name: 'uuid', length: 50 })
  uuid: string;

  @Column('varchar', { name: 'country', length: 10 })
  country: string;

  @Column('varchar', { name: 'province', length: 15 })
  province: string;

  @Column('varchar', { name: 'city', length: 15 })
  city: string;

  @Column('bigint', { name: 'project_id', default: () => "'0'" })
  projectId: string;

  @Column('varchar', { name: 'visit_at_hour', length: 20 })
  visitAtHour: string;

  @Column('int', { name: 'pv_count', default: () => "'0'" })
  pvCount: number;

  @Column('bigint', { name: 'create_time', default: () => "'0'" })
  createTime: string;

  @Column('bigint', { name: 'update_time', default: () => "'0'" })
  updateTime: string;
}

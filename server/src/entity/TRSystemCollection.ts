import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

// @Index('uniq_visit_at_month_uuid', ['uuid'], { unique: true })TODO: // 删除
@Entity('t_r_system_collection', { schema: 'nest' })
export class TRSystemCollection {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id', unsigned: true })
  id: string;

  @Column('varchar', { name: 'uuid', length: 50 })
  uuid: string;

  @Column('varchar', { name: 'browser', length: 50 })
  browser: string;

  @Column('bigint', { name: 'project_id', default: () => "'0'" })
  projectId: string;

  @Column('varchar', { name: 'browser_version', length: 100 })
  browserVersion: string;

  @Column('varchar', { name: 'engine', length: 100 })
  engine: string;

  @Column('varchar', { name: 'engine_version', length: 100 })
  engineVersion: string;

  @Column('varchar', { name: 'device_vendor', length: 100 })
  deviceVendor: string;

  @Column('varchar', { name: 'device_model', length: 100 })
  deviceModel: string;

  @Column('varchar', { name: 'os', length: 50 })
  os: string;

  @Column('varchar', { name: 'os_version', length: 50 })
  osVersion: string;

  @Column('varchar', { name: 'country', length: 10 })
  country: string;

  @Column('varchar', { name: 'province', length: 15 })
  province: string;

  @Column('varchar', { name: 'city', length: 15 })
  city: string;

  @Column('varchar', { name: 'runtime_version', length: 50 })
  runtimeVersion: string;

  @Column('varchar', { name: 'visit_at_month', length: 20 })
  visitAtMonth: string;

  @Column('bigint', { name: 'log_at', default: () => "'0'" })
  logAt: string;

  @Column('bigint', { name: 'create_time', default: () => "'0'" })
  createTime: string;

  @Column('bigint', { name: 'update_time', default: () => "'0'" })
  updateTime: string;
}

import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("t_r_alarm_config", { schema: "nest" })
export class TRAlarmConfig {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: string;

  @Column("bigint", {
    name: "project_id",
    unsigned: true,
    default: () => "'0'"
  })
  projectId: string;

  @Column("varchar", { name: "owner_ucid", length: 20 })
  ownerUcid: string;

  @Column("varchar", { name: "error_type", length: 20 })
  errorType: string;

  @Column("varchar", { name: "error_name", length: 255 })
  errorName: string;

  @Column("int", { name: "time_range_s", unsigned: true, default: () => "'0'" })
  timeRangeS: number;

  @Column("int", {
    name: "max_error_count",
    unsigned: true,
    default: () => "'0'"
  })
  maxErrorCount: number;

  @Column("bigint", {
    name: "alarm_interval_s",
    unsigned: true,
    default: () => "'0'"
  })
  alarmIntervalS: string;

  @Column("tinyint", {
    name: "is_enable",
    unsigned: true,
    default: () => "'1'"
  })
  isEnable: number;

  @Column("varchar", { name: "note", length: 255 })
  note: string;

  @Column("tinyint", {
    name: "is_delete",
    unsigned: true,
    default: () => "'0'"
  })
  isDelete: number;

  @Column("varchar", { name: "create_ucid", length: 20 })
  createUcid: string;

  @Column("varchar", { name: "update_ucid", length: 20 })
  updateUcid: string;

  @Column("bigint", {
    name: "create_time",
    unsigned: true,
    default: () => "'0'"
  })
  createTime: string;

  @Column("bigint", {
    name: "update_time",
    unsigned: true,
    default: () => "'0'"
  })
  updateTime: string;
}

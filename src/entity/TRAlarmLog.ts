import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("idx_send_at_project_id", ["sendAt", "projectId"], {})
@Entity("t_r_alarm_log", { schema: "nest" })
export class TRAlarmLog {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: string;

  @Column("bigint", {
    name: "project_id",
    unsigned: true,
    default: () => "'0'"
  })
  projectId: string;

  @Column("bigint", { name: "config_id", unsigned: true, default: () => "'0'" })
  configId: string;

  @Column("bigint", { name: "send_at", default: () => "'0'" })
  sendAt: string;

  @Column("varchar", { name: "error_type", length: 20 })
  errorType: string;

  @Column("varchar", { name: "error_name", length: 255 })
  errorName: string;

  @Column("varchar", { name: "message", length: 500 })
  message: string;

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

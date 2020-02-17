import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("t_r_monitor_ext", { schema: "nest" })
export class TRMonitorExt {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: string;

  @Column("text", { name: "ext_json", nullable: true })
  extJson: string | null;

  @Column("bigint", { name: "create_time", default: () => "'0'" })
  createTime: string;

  @Column("bigint", { name: "update_time", default: () => "'0'" })
  updateTime: string;
}

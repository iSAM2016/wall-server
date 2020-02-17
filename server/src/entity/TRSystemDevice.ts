import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("idx_project_id_count_at_month", ["projectId", "countAtMonth"], {})
@Entity("t_r_system_device", { schema: "nest" })
export class TRSystemDevice {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: string;

  @Column("bigint", { name: "project_id", default: () => "'0'" })
  projectId: string;

  @Column("varchar", { name: "device_vendor", length: 50 })
  deviceVendor: string;

  @Column("varchar", { name: "device_model", length: 50 })
  deviceModel: string;

  @Column("int", { name: "total_count", unsigned: true, default: () => "'0'" })
  totalCount: number;

  @Column("varchar", { name: "count_at_month", length: 15 })
  countAtMonth: string;

  @Column("bigint", { name: "city_distribute_id", default: () => "'0'" })
  cityDistributeId: string;

  @Column("bigint", { name: "create_time", default: () => "'0'" })
  createTime: string;

  @Column("bigint", { name: "update_time", default: () => "'0'" })
  updateTime: string;
}

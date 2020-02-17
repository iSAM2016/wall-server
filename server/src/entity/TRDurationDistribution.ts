import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index(
  "idx_project_id_count_type_count_at_time",
  ["projectId", "countType", "countAtTime"],
  {}
)
@Entity("t_r_duration_distribution", { schema: "nest" })
export class TRDurationDistribution {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: string;

  @Column("bigint", { name: "project_id", default: () => "'0'" })
  projectId: string;

  @Column("bigint", { name: "total_stay_ms", default: () => "'0'" })
  totalStayMs: string;

  @Column("int", { name: "total_uv", default: () => "'0'" })
  totalUv: number;

  @Column("varchar", { name: "count_at_time", length: 30 })
  countAtTime: string;

  @Column("varchar", { name: "count_type", length: 20, default: () => "'day'" })
  countType: string;

  @Column("bigint", { name: "city_distribute_id", default: () => "'0'" })
  cityDistributeId: string;

  @Column("bigint", { name: "create_time", default: () => "'0'" })
  createTime: string;

  @Column("bigint", { name: "update_time", default: () => "'0'" })
  updateTime: string;
}

import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index(
  "idx_project_id_count_type_count_at_time",
  ["projectId", "countType", "countAtTime"],
  {}
)
@Entity("t_r_http_error_distribution", { schema: "nest" })
export class TRHttpErrorDistribution {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: string;

  @Column("bigint", { name: "project_id", default: () => "'0'" })
  projectId: string;

  @Column("int", { name: "total_count", default: () => "'0'" })
  totalCount: number;

  @Column("int", { name: "http_code_2xx_count", default: () => "'0'" })
  httpCode_2xxCount: number;

  @Column("int", { name: "http_code_3xx_count", default: () => "'0'" })
  httpCode_3xxCount: number;

  @Column("int", { name: "http_code_4xx_count", default: () => "'0'" })
  httpCode_4xxCount: number;

  @Column("int", { name: "http_code_5xx_count", default: () => "'0'" })
  httpCode_5xxCount: number;

  @Column("int", { name: "http_code_other_count", default: () => "'0'" })
  httpCodeOtherCount: number;

  @Column("bigint", { name: "city_distribute_id", default: () => "'0'" })
  cityDistributeId: string;

  @Column("varchar", { name: "count_at_time", length: 30 })
  countAtTime: string;

  @Column("varchar", {
    name: "count_type",
    length: 20,
    default: () => "'hour'"
  })
  countType: string;

  @Column("bigint", { name: "update_time", default: () => "'0'" })
  updateTime: string;

  @Column("bigint", { name: "create_time", default: () => "'0'" })
  createTime: string;
}

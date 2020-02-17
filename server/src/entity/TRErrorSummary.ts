import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index(
  "idx_count_at_time_count_type_error_type_error_name",
  ["countAtTime", "countType", "errorType", "errorName"],
  {}
)
@Entity("t_r_error_summary", { schema: "nest" })
export class TRErrorSummary {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: string;

  @Column("varchar", { name: "error_type", length: 20 })
  errorType: string;

  @Column("varchar", { name: "error_name", length: 255 })
  errorName: string;

  @Column("varchar", { name: "url_path", length: 255 })
  urlPath: string;

  @Column("bigint", {
    name: "city_distribution_id",
    unsigned: true,
    default: () => "'0'"
  })
  cityDistributionId: string;

  @Column("varchar", { name: "count_at_time", length: 20 })
  countAtTime: string;

  @Column("varchar", { name: "count_type", length: 10, default: () => "'day'" })
  countType: string;

  @Column("int", { name: "error_count", default: () => "'0'" })
  errorCount: number;

  @Column("int", { name: "create_time", default: () => "'0'" })
  createTime: number;

  @Column("int", { name: "update_time", default: () => "'0'" })
  updateTime: number;
}

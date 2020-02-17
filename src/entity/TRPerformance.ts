import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index(
  "idx_count_at_time_count_type_url_indicator",
  ["countAtTime", "countType", "url", "indicator"],
  {}
)
@Entity("t_r_performance", { schema: "nest" })
export class TRPerformance {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: string;

  @Column("bigint", { name: "sum_indicator_value", default: () => "'0'" })
  sumIndicatorValue: string;

  @Column("bigint", { name: "pv", default: () => "'0'" })
  pv: string;

  @Column("varchar", { name: "indicator", length: 50 })
  indicator: string;

  @Column("varchar", { name: "url", length: 255 })
  url: string;

  @Column("bigint", { name: "city_distribute_id", default: () => "'0'" })
  cityDistributeId: string;

  @Column("varchar", { name: "count_at_time", length: 20 })
  countAtTime: string;

  @Column("varchar", {
    name: "count_type",
    length: 10,
    default: () => "'minute'"
  })
  countType: string;

  @Column("bigint", { name: "create_time", default: () => "'0'" })
  createTime: string;

  @Column("bigint", { name: "update_time", default: () => "'0'" })
  updateTime: string;
}

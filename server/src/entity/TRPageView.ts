import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index(
  "uniq_project_id_count_type_count_at_time",
  ["projectId", "countType", "countAtTime"],
  { unique: true }
)
@Entity("t_r_page_view", { schema: "nest" })
export class TRPageView {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: string;

  @Column("bigint", { name: "project_id", default: () => "'0'" })
  projectId: string;

  @Column("int", { name: "total_count", default: () => "'0'" })
  totalCount: number;

  @Column("varchar", { name: "count_at_time", length: 30 })
  countAtTime: string;

  @Column("varchar", {
    name: "count_type",
    length: 20,
    default: () => "'hour'"
  })
  countType: string;

  @Column("bigint", { name: "city_distribute_id", default: () => "'0'" })
  cityDistributeId: string;

  @Column("bigint", { name: "create_time", default: () => "'0'" })
  createTime: string;

  @Column("bigint", { name: "update_time", default: () => "'0'" })
  updateTime: string;
}

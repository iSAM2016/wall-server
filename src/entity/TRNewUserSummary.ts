import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("idx_count_at_time_project_id", ["countAtTime", "projectId"], {})
@Entity("t_r_new_user_summary", { schema: "nest" })
export class TRNewUserSummary {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: string;

  @Column("bigint", { name: "project_id", default: () => "'0'" })
  projectId: string;

  @Column("int", { name: "total_count", default: () => "'0'" })
  totalCount: number;

  @Column("varchar", { name: "count_at_time", length: 20 })
  countAtTime: string;

  @Column("varchar", { name: "count_type", length: 10, default: () => "'day'" })
  countType: string;

  @Column("bigint", { name: "city_distribute_id", default: () => "'0'" })
  cityDistributeId: string;

  @Column("bigint", { name: "create_time", default: () => "'0'" })
  createTime: string;

  @Column("bigint", { name: "update_time", default: () => "'0'" })
  updateTime: string;
}

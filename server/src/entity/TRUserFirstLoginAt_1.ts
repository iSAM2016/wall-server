import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("uniq_ucid", ["ucid"], { unique: true })
@Index("idx_first_visit_at", ["firstVisitAt"], {})
@Entity("t_r_user_first_login_at_1", { schema: "nest" })
export class TRUserFirstLoginAt_1 {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: string;

  @Column("varchar", { name: "ucid", unique: true, length: 20 })
  ucid: string;

  @Column("bigint", { name: "first_visit_at", default: () => "'0'" })
  firstVisitAt: string;

  @Column("varchar", { name: "country", length: 10 })
  country: string;

  @Column("varchar", { name: "province", length: 15 })
  province: string;

  @Column("varchar", { name: "city", length: 15 })
  city: string;

  @Column("bigint", { name: "create_time", default: () => "'0'" })
  createTime: string;

  @Column("bigint", { name: "update_time", default: () => "'0'" })
  updateTime: string;
}

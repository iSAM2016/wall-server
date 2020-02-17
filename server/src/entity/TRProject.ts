import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("uniq_project_name", ["projectName"], { unique: true })
@Entity("t_r_project", { schema: "nest" })
export class TRProject {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: string;

  @Column("varchar", { name: "display_name", length: 50 })
  displayName: string;

  @Column("varchar", { name: "project_name", unique: true, length: 50 })
  projectName: string;

  @Column("varchar", { name: "c_desc", length: 100 })
  cDesc: string;

  @Column("int", { name: "rate", default: () => "'10000'" })
  rate: number;

  @Column("tinyint", { name: "is_delete", width: 1, default: () => "'0'" })
  isDelete: boolean;

  @Column("varchar", { name: "create_ucid", length: 20 })
  createUcid: string;

  @Column("varchar", { name: "update_ucid", length: 20 })
  updateUcid: string;

  @Column("bigint", { name: "create_time", default: () => "'0'" })
  createTime: string;

  @Column("bigint", { name: "update_time", default: () => "'0'" })
  updateTime: string;
}

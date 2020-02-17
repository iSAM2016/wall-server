import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("t_o_project_member", { schema: "nest" })
export class TOProjectMember {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: string;

  @Column("bigint", {
    name: "project_id",
    unsigned: true,
    default: () => "'0'"
  })
  projectId: string;

  @Column("varchar", { name: "ucid", length: 20 })
  ucid: string;

  @Column("varchar", { name: "role", length: 20 })
  role: string;

  @Column("tinyint", {
    name: "need_alarm",
    unsigned: true,
    default: () => "'0'"
  })
  needAlarm: number;

  @Column("tinyint", {
    name: "is_delete",
    unsigned: true,
    default: () => "'0'"
  })
  isDelete: number;

  @Column("varchar", { name: "create_ucid", length: 20 })
  createUcid: string;

  @Column("varchar", { name: "update_ucid", length: 20 })
  updateUcid: string;

  @Column("bigint", {
    name: "create_time",
    unsigned: true,
    default: () => "'0'"
  })
  createTime: string;

  @Column("bigint", {
    name: "update_time",
    unsigned: true,
    default: () => "'0'"
  })
  updateTime: string;
}

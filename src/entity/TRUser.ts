import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("uniq_ucid", ["ucid"], { unique: true })
@Index("uniq_account", ["account"], { unique: true })
@Entity("t_r_user", { schema: "nest" })
export class TRUser {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: string;

  @Column("varchar", { name: "ucid", unique: true, length: 50 })
  ucid: string;

  @Column("varchar", { name: "account", unique: true, length: 50 })
  account: string;

  @Column("varchar", { name: "email", length: 50 })
  email: string;

  @Column("varchar", { name: "password_md5", length: 32 })
  passwordMd5: string;

  @Column("varchar", { name: "nickname", length: 20 })
  nickname: string;

  @Column("varchar", { name: "role", length: 50, default: () => "'dev'" })
  role: string;

  @Column("varchar", {
    name: "register_type",
    length: 20,
    default: () => "'site'"
  })
  registerType: string;

  @Column("varchar", {
    name: "avatar_url",
    length: 200,
    default: () =>
      "'http://ww1.sinaimg.cn/large/00749HCsly1fwofq2t1kaj30qn0qnaai.jpg'"
  })
  avatarUrl: string;

  @Column("varchar", { name: "mobile", length: 20 })
  mobile: string;

  @Column("tinyint", {
    name: "is_delete",
    unsigned: true,
    default: () => "'0'"
  })
  isDelete: number;

  @Column("bigint", { name: "create_time", default: () => "'0'" })
  createTime: string;

  @Column("bigint", { name: "update_time", default: () => "'0'" })
  updateTime: string;
}

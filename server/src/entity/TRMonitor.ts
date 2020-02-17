import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("uniq_log_at_md5", ["logAt", "md5"], { unique: true })
@Index(
  "idx_log_at_error_type_error_name_url",
  ["logAt", "errorType", "errorName", "url"],
  {}
)
@Entity("t_r_monitor", { schema: "nest" })
export class TRMonitor {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: string;

  @Column("varchar", { name: "error_type", length: 20 })
  errorType: string;

  @Column("varchar", { name: "error_name", length: 255 })
  errorName: string;

  @Column("int", { name: "http_code", default: () => "'0'" })
  httpCode: number;

  @Column("bigint", { name: "monitor_ext_id", default: () => "'0'" })
  monitorExtId: string;

  @Column("int", { name: "during_ms", unsigned: true, default: () => "'0'" })
  duringMs: number;

  @Column("int", {
    name: "request_size_b",
    unsigned: true,
    default: () => "'0'"
  })
  requestSizeB: number;

  @Column("int", {
    name: "response_size_b",
    unsigned: true,
    default: () => "'0'"
  })
  responseSizeB: number;

  @Column("varchar", { name: "url", length: 255 })
  url: string;

  @Column("varchar", { name: "country", length: 10 })
  country: string;

  @Column("varchar", { name: "province", length: 15 })
  province: string;

  @Column("varchar", { name: "city", length: 15 })
  city: string;

  @Column("bigint", { name: "log_at", default: () => "'0'" })
  logAt: string;

  @Column("char", { name: "md5", length: 32 })
  md5: string;

  @Column("bigint", { name: "create_time", default: () => "'0'" })
  createTime: string;

  @Column("bigint", { name: "update_time", default: () => "'0'" })
  updateTime: string;
}

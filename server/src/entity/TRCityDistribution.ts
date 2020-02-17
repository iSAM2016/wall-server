import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("t_r_city_distribution", { schema: "nest" })
export class TRCityDistribution {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: string;

  @Column("text", { name: "city_distribute_json", nullable: true })
  cityDistributeJson: string | null;

  @Column("bigint", { name: "create_time", default: () => "'0'" })
  createTime: string;

  @Column("bigint", { name: "update_time", default: () => "'0'" })
  updateTime: string;
}

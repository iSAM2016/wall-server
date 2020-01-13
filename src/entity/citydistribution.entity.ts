import {
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  PrimaryColumn,
} from 'typeorm';

import Base from './base.entity';

@Entity('city_distribution')
export class CityDistribution extends Base {
  @PrimaryColumn()
  @PrimaryGeneratedColumn()
  id: number;
  // 项目id
  @Column({})
  city_distribute_json: string;
}

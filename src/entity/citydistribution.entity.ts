import { Column, Entity, OneToOne } from 'typeorm';
import Base from './base.entity';
@Entity('city_distribution')
export class CityDistribution extends Base {
  @Column({ type: 'text' })
  city_distribute_json: string;
}

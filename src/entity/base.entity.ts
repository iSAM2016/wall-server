import { Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';

export default class Base {
  @PrimaryGeneratedColumn()
  @PrimaryColumn({ unsigned: true, width: 20, type: 'bigint' })
  id: number;

  @Column({ type: 'bigint', width: 10, default: 0 })
  created_date: number;

  @Column({ type: 'bigint', width: 10, default: 0 })
  updated_date: number;
}

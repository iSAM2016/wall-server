import { Column, UpdateDateColumn } from 'typeorm';

export default class Base {
  @Column({ type: 'bigint', width: 10, default: 0 })
  created_date: number;

  @Column({ type: 'bigint', width: 10, default: 0 })
  updated_date: number;
}

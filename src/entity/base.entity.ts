import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export default class Base {
  @CreateDateColumn() created_date: Date;

  @UpdateDateColumn() updated_date: Date;
}

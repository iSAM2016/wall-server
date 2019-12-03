import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RegisterEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  name: string;

  @Column('text')
  loginname: string;

  @Column()
  pass: string;

  @Column('int')
  re_pass: number;

  @Column()
  email: boolean;
}

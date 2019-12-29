/* 错误集合
 * @Author: isam2016
 * @Date: 2019-12-27 21:44:29
 * @Last Modified by: isam2016
 * @Last Modified time: 2019-12-28 21:09:09
 */

import {
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  PrimaryColumn,
} from 'typeorm';

import Base from './base.entity';

@Entity('error_list_sub')
export class errorListSub extends Base {
  @PrimaryGeneratedColumn()
  id: number;

  parent_id: number;

  
 version: 
 

  system_apple: number;

  //   behaviors: string; //行为id 集合
  happend: number; // 发生的次数

  useer_num: number; // 发生的次数

  @ManyToOne(
    type => User,
    user => user.favorites,
    { primary: true, onDelete: 'CASCADE' },
  )
  @JoinColumn()
  user: User;

  @ManyToOne(
    type => Todo,
    todo => todo.favorites,
    { primary: true, onDelete: 'CASCADE' },
  )
  @JoinColumn()
  todo: Todo;
}

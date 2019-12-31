/* 相同错误的父类
 * @Author: isam2016
 * @Date: 2019-12-27 21:43:57
 * @Last Modified by: isam2016
 * @Last Modified time: 2019-12-27 21:44:18
 */

import {
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  PrimaryColumn,
} from 'typeorm';

import { Todo, User } from '.';
import Base from './base.entity';

@Entity('error_list')
export class errorList extends Base {
  @PrimaryGeneratedColumn()
  id: number;

  type: number; // 错误类型

  key: string; // 唯一身份值

  system_mac: number; // 苹果系统发生次数

  system_win: number; // win

  system_android: number;

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

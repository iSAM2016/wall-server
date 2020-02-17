import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Favorite, Profile, Role, Todo } from '.';
import Base from './base.entity';

@Entity('user')
export class User extends Base {
  @Column({ length: 50, default: '' })
  ucid: string;

  @Column({ length: 50, default: '' })
  account: string;

  @Column({ length: 20, default: '' })
  nickname: string;

  @Column({ length: 50, default: '' })
  email: string;

  @Column({ length: 32, default: '' })
  password_md5: string;

  @Column({ length: 50, default: 'dev' })
  role: string;

  @Column({ length: 20, default: 'site' })
  register_type: string;

  @Column({
    length: 200,
    default: 'http://ww1.sinaimg.cn/large/00749HCsly1fwofq2t1kaj30qn0qnaai.jpg',
  })
  avatar_url: string;

  @Column({ length: 20, default: '' })
  mobile: string;

  @Column({ type: 'tinyint', default: 0, width: 0, unsigned: true })
  is_delete: number; //

  // @OneToOne(
  //   type => Profile,
  //   profile => profile.user,
  // )
  // profile: Profile;

  // @OneToOne(
  //   type => Role,
  //   role => role.user,
  //   {
  //     onDelete: 'SET NULL',
  //     //   cascadeInsert: true,
  //     //   cascadeUpdate: true,
  //   },
  // )
  // @JoinColumn()
  // role: Role;

  // @OneToMany(
  //   type => Todo,
  //   todo => todo.user,
  // )
  // todos: Todo[];

  // @OneToMany(
  //   type => Favorite,
  //   favorite => favorite.user,
  // )
  // favorites: Favorite[];
}

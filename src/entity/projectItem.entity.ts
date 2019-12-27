import {
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  PrimaryColumn,
} from 'typeorm';
import Base from './base.entity';

@Entity('project_item')
export class ProjectItem extends Base {
  @PrimaryColumn()
  @PrimaryGeneratedColumn()
  id: number;

  @Column({})
  project_name: string;

  @Column({ default: '' })
  display_name: string;

  @Column({ default: '' })
  rate: string;

  @Column({ default: '' })
  c_desc: string;

  // 创建人的ID
  @Column('int')
  create_ucid: number;

  @Column('int')
  update_ucid: number;

  @Column({ type: 'tinyint' })
  is_delete: number;

  //   @OneToOne(
  //     type => User,
  //     user => user.role,
  //   )
  //   user: User;
}

// Column types for mysql / mariadb
// int, tinyint, smallint, mediumint, bigint, float, double, dec,
// decimal, numeric, date, datetime, timestamp, time, year, char,
// varchar, nvarchar, text, tinytext, mediumtext, blob, longtext,
// tinyblob, mediumblob, longblob, enum, json, binary, geometry,
// point, linestring, polygon,
// multipoint, multilinestring, multipolygon,
// geometrycollection

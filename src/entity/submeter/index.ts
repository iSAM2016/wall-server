//  首次用户登录模板

let getSubTableName = tableName => tableName.split('t_r_s')[1];

let baseSql = {
  t_r_monitor: (tableName: string) => {
    return `
        import { Column, Entity, OneToOne } from 'typeorm';
    
    import Base from './base.entity';
    @Entity('${getSubTableName(tableName)}')
    export class ${getSubTableName(tableName)} extends Base {
      @Column({ length: 20, default: '' })
      ucid: string;
    
      @Column({ type: 'bigint', default: 0, width: 20 })
      first_visit_at: number; // 停留的时间
    
      @Column({ length: 10, default: '' })
      country: string; //
    
      @Column({ length: 15, default: '' })
      province: string;
    
      @Column({ length: 15, default: '' })
      city: string;
    }
        `;
  },

  t_r_monitor_ext: (tableName: string) => {
    return `
    import { Column, Entity, OneToOne } from 'typeorm';

import Base from './base.entity';
@Entity('${getSubTableName(tableName)}')
export class ${getSubTableName(tableName)} extends Base {
  @Column({ length: 20, default: '' })
  ucid: string;

  @Column({ type: 'bigint', default: 0, width: 20 })
  first_visit_at: number; // 停留的时间

  @Column({ length: 10, default: '' })
  country: string; //

  @Column({ length: 15, default: '' })
  province: string;

  @Column({ length: 15, default: '' })
  city: string;
}
    `;
  },
  t_r_uv_record: (tableName: string) => {
    return `
    import { Column, Entity, OneToOne } from 'typeorm';

import Base from './base.entity';
@Entity('${getSubTableName(tableName)}')
export class ${getSubTableName(tableName)} extends Base {
  @Column({ length: 20, default: '' })
  ucid: string;

  @Column({ type: 'bigint', default: 0, width: 20 })
  first_visit_at: number; // 停留的时间

  @Column({ length: 10, default: '' })
  country: string; //

  @Column({ length: 15, default: '' })
  province: string;

  @Column({ length: 15, default: '' })
  city: string;
}
    `;
  },
  t_r_city_distribution: (tableName: string) => {
    return `
    import { Column, Entity, OneToOne } from 'typeorm';

import Base from './base.entity';
@Entity('${getSubTableName(tableName)}')
export class ${getSubTableName(tableName)} extends Base {
  @Column({ length: 20, default: '' })
  ucid: string;

  @Column({ type: 'bigint', default: 0, width: 20 })
  first_visit_at: number; // 停留的时间

  @Column({ length: 10, default: '' })
  country: string; //

  @Column({ length: 15, default: '' })
  province: string;

  @Column({ length: 15, default: '' })
  city: string;
}
    `;
  },
  t_r_performance: (tableName: string) => {
    return `
    import { Column, Entity, OneToOne } from 'typeorm';

import Base from './base.entity';
@Entity('${getSubTableName(tableName)}')
export class ${getSubTableName(tableName)} extends Base {
  @Column({ length: 20, default: '' })
  ucid: string;

  @Column({ type: 'bigint', default: 0, width: 20 })
  first_visit_at: number; // 停留的时间

  @Column({ length: 10, default: '' })
  country: string; //

  @Column({ length: 15, default: '' })
  province: string;

  @Column({ length: 15, default: '' })
  city: string;
}
    `;
  },
  t_r_system_collection: (tableName: string) => {
    return `
    import { Column, Entity, OneToOne } from 'typeorm';

import Base from './base.entity';
@Entity('${getSubTableName(tableName)}')
export class ${getSubTableName(tableName)} extends Base {
  @Column({ length: 20, default: '' })
  ucid: string;

  @Column({ type: 'bigint', default: 0, width: 20 })
  first_visit_at: number; // 停留的时间

  @Column({ length: 10, default: '' })
  country: string; //

  @Column({ length: 15, default: '' })
  province: string;

  @Column({ length: 15, default: '' })
  city: string;
}
    `;
  },
  t_r_user_first_login_at: (tableName: string) => {
    return `
    import { Column, Entity, OneToOne } from 'typeorm';

import Base from './base.entity';
@Entity('${getSubTableName(tableName)}')
export class ${getSubTableName(tableName)} extends Base {
  @Column({ length: 20, default: '' })
  ucid: string;

  @Column({ type: 'bigint', default: 0, width: 20 })
  first_visit_at: number; // 停留的时间

  @Column({ length: 10, default: '' })
  country: string; //

  @Column({ length: 15, default: '' })
  province: string;

  @Column({ length: 15, default: '' })
  city: string;
}
    `;
  },
  t_r_error_summary: (tableName: string) => {
    return `
    import { Column, Entity, OneToOne } from 'typeorm';

import Base from './base.entity';
@Entity('${getSubTableName(tableName)}')
export class ${getSubTableName(tableName)} extends Base {
  @Column({ length: 20, default: '' })
  ucid: string;

  @Column({ type: 'bigint', default: 0, width: 20 })
  first_visit_at: number; // 停留的时间

  @Column({ length: 10, default: '' })
  country: string; //

  @Column({ length: 15, default: '' })
  province: string;

  @Column({ length: 15, default: '' })
  city: string;
}
    `;
  },
};

export default baseSql;

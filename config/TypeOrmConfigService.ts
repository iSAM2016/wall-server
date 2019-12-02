// import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
// import { ConfigService } from '../../config/config.service';
// import { DatabaseType } from 'typeorm';
// import { Injectable } from '@nestjs/common';

// @Injectable()
// export class TypeOrmConfigService implements TypeOrmOptionsFactory {
//   constructor(private readonly configService: ConfigService) {}
//   createTypeOrmOptions(): TypeOrmModuleOptions {
//     return {
//       type: 'mysql',
//       host: 'localhost',
//       port: 3306,
//       username: 'root',
//       password: 'abc123456',
//       database: 'nest',
//       entities: ['dist/src/**/**.entity{.ts,.js}'],
//       synchronize: true,
//     };
//   }
// }

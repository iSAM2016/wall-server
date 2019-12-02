import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '../../config/config.module';
import { ConfigService } from '../../config/config.service';
// import { ConfigValidate } from './config.validate';
@Module({
  imports: [
    ConfigModule,

    // TODO: 使用了useClass
    // TypeOrmModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [
    //     // 宣告哪个provider或是service需要被注入
    //     ConfigService,
    //   ],
    //   // 指定用TypeOrmConfigService，作为载入TypeOrmOptions
    //   // Options就是数据库连接信息等
    //   useClass: TypeOrmConfigService,
    // }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('MYSQL_HOST'),
        port: Number(configService.get('MYSQL_PORT')),
        username: configService.get('MYSQL_USERNAME'),
        password: configService.get('MYSQL_PASSWORD'),
        database: configService.get('MYSQL_DATABASE'),
        entities: ['dist/src/**/**.entity{.ts,.js}'],
        synchronize: Boolean(configService.get('MYSQL_SYNCHRONIZE')),
      }),

      inject: [ConfigService],
    }),
  ],
  exports: [ConfigModule],
})
export class CoreModule {}

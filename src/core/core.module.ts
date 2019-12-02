import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '../../config/config.module';
import { ConfigService } from '../../config/config.service';
// import { ConfigValidate } from './config.validate';
@Module({
  imports: [
    ConfigModule,
    //     ConfigModule.resolveRootPath(resolve(__dirname, '../..'))
    //       .resolveEnvValidator(new ConfigValidate())
    //       .forRoot(resolve(__dirname, '..', 'config', '**', '!(*.d).{ts,js}'), {
    //         path: `${process.env.NODE_ENV || 'development'}.env`,
    //       }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: 'abc123456',
        database: 'nest',
        entities: ['dist/src/**/**.entity{.ts,.js}'],
        synchronize: true,
      }),
    }),
  ],
  exports: [ConfigModule],
})
export class CoreModule {}

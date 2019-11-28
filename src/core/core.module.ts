import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '../../config/config.module';
import { Photo } from '../feature/photo/photo.entity';
// import { ConfigValidate } from './config.validate';
import { resolve } from 'path';
@Module({
  imports: [
    ConfigModule,
    //     ConfigModule.resolveRootPath(resolve(__dirname, '../..'))
    //       .resolveEnvValidator(new ConfigValidate())
    //       .forRoot(resolve(__dirname, '..', 'config', '**', '!(*.d).{ts,js}'), {
    //         path: `${process.env.NODE_ENV || 'development'}.env`,
    //       }),
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('env.MONGODB_URI'),
        useNewUrlParser: true,
      }),
    }),
  ],
  exports: [ConfigModule],
})
export class CoreModule {}

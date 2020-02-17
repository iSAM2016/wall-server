import { Module } from '@nestjs/common';
import { UserFirstLoginAtService } from './user_first_login_at.service';
import { TRUserFirstLoginAt } from '@entity';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [TypeOrmModule.forFeature([TRUserFirstLoginAt])],
  exports: [UserFirstLoginAtService],
  providers: [UserFirstLoginAtService],
})
export class UserFirstLoginAtModule {}

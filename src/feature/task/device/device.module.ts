import { Module } from '@nestjs/common';
import { DeviceService } from './device.service';
import { TRSystemCollection } from '@entity';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [TypeOrmModule.forFeature([TRSystemCollection])],
  exports: [DeviceService],
  providers: [DeviceService],
})
export class DeviceModule {}

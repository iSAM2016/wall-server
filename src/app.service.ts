import { Injectable } from '@nestjs/common';
import { ConfigService } from '@core';
@Injectable()
export class AppService {
  private helloMessage: string;
  constructor(configService: ConfigService) {
    this.helloMessage = configService.get('MYSQL_SYNCHRONIZE');
  }
  getHello(): string {
    return 'Hello Worlss!';
  }
}

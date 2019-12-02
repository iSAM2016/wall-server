import { Injectable } from '@nestjs/common';
// import { ConfigService } from './core/config/config.service';
@Injectable()
export class AppService {
  private isAuthEnabled: boolean;
  constructor() {
    // Please take note that this check is case sensitive!
    // console.log(config);
    // this.isAuthEnabled = config.get('IS_AUTH_ENABLED') === 'true';
  }
  getHello(): string {
    console.log(1);
    return 'Hello World!';
  }
}

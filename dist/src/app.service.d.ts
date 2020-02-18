import { ConfigService } from './core/configure/config.service';
export declare class AppService {
    private helloMessage;
    constructor(configService: ConfigService);
    getHello(): string;
}

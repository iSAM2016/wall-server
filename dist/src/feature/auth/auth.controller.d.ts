import { Request, Response } from 'express';
import { Register } from '../../entity';
import { SignUpDto, SignInDto } from './dto';
import { AuthService } from './auth.service';
import { ConfigService } from '../../core/configure/config.service';
export declare class AuthController {
    private readonly authService;
    private readonly config;
    constructor(authService: AuthService, config: ConfigService);
    register(register: Register): Promise<{
        error: string;
        success?: undefined;
    } | {
        success: string;
        error?: undefined;
    }>;
    signUP(body: SignUpDto): Promise<void>;
    signIn(body: SignInDto, req: Request, res: Response): Promise<any>;
}

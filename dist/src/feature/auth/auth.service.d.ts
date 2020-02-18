import { Repository } from 'typeorm';
import { SignUpDto, SignInDto } from './dto';
import { MailService } from 'src/shared/services';
import { Register, Role, User, Profile } from '../../entity';
import { ConfigService } from '../../core/configure/config.service';
export declare class AuthService {
    private readonly registoryRepository;
    private readonly roleRepository;
    private readonly profileRepository;
    private readonly userRepository;
    private readonly config;
    private readonly mailService;
    constructor(registoryRepository: Repository<Register>, roleRepository: Repository<Role>, profileRepository: Repository<Profile>, userRepository: Repository<User>, config: ConfigService, mailService: MailService);
    register(register: Register): Promise<{
        error: string;
        success?: undefined;
    } | {
        success: string;
        error?: undefined;
    }>;
    signUP(body: SignUpDto): Promise<void>;
    signIn(body: SignInDto): Promise<any>;
}

/// <reference types="socket.io" />
import { User } from '../../entity';
import { Repository } from 'typeorm';
export declare class AuthGatewayMiddleware {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    resolve(): (socket: import("socket.io").Socket, next: Function) => Promise<void>;
    private verifyJWT;
}

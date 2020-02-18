import { UserService } from './user.service';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    addUser(res: any, userName: any): Promise<void>;
}

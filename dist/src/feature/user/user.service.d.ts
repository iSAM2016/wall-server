import { User } from './types/User.type';
export declare class UserService {
    private USERS;
    private count;
    addUser(userName: string): Promise<User>;
}

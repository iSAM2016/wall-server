import { User } from 'src/entity';
export declare class SignUpDto extends User {
    email: string;
    password: string;
    firstName: string;
    lastName?: string;
}

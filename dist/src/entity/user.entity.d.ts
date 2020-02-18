import Base from './base.entity';
export declare class User extends Base {
    ucid: string;
    account: string;
    nickname: string;
    email: string;
    password_md5: string;
    role: string;
    register_type: string;
    avatar_url: string;
    mobile: string;
    is_delete: number;
}

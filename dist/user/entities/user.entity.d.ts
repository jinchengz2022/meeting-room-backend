import { Role } from "./role.entity";
export declare class User {
    id: number;
    username: string;
    password: string;
    nickName: string;
    email: string;
    headPic: string;
    phoneNumber: string;
    isFrozen: boolean;
    isAdmin: boolean;
    createTime: Date;
    updateTime: Date;
    roles: Role[];
}
export declare enum LoginType {
    USERNAME_PASSWORD = 0,
    GOOGLE = 1,
    GITHUB = 2
}

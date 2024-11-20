import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/index';
import { LoginDto } from './dto/login.dto';
import { LoginUserVo } from './vo/login.vo';
import { UpdatePasswordDTO } from './dto/update-password.dto';
export declare class UserService {
    private logger;
    private userRepository;
    private roleRepository;
    private permissionRepository;
    private redisService;
    create(user: CreateUserDto): Promise<"success" | "fail">;
    initData(): Promise<void>;
    login(params: LoginDto, isAdmin: boolean): Promise<LoginUserVo>;
    findUserById(id: number, isAdmin: boolean): Promise<{
        password: string;
        id: number;
        username: string;
        nickName: string;
        email: string;
        phoneNumber: string;
        headPic: string;
        createTime: number;
        isFrozen: boolean;
        isAdmin: boolean;
        roles: string[];
        permissions: any[];
    }>;
    findUserDatailById(id: number): Promise<User>;
    updatePassword(updatePasswordDto: UpdatePasswordDTO): Promise<"success" | "error">;
    update(updateDto: UpdateUserDto): Promise<"success" | "error">;
    freeze(id: number): Promise<void>;
    unFreeze(id: number): Promise<void>;
    findUsersByPage(params: {
        pageNumber: number;
        pageSize: number;
        email?: string;
        username?: string;
        nickName?: string;
        phoneNumber?: string;
        all?: boolean;
    }): Promise<{
        data: User[];
        totalCount: number;
    }>;
}

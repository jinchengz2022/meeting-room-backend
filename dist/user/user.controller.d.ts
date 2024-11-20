import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login.dto';
import { UserInfoVo } from './vo/user-info.vo';
import { UpdatePasswordDTO } from './dto/update-password.dto';
import { LoginUserVo } from './vo/login.vo';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    register(createUserDto: CreateUserDto): Promise<"success" | "fail">;
    init(): Promise<string>;
    private jwtService;
    private configService;
    login(loginDto: LoginDto): Promise<LoginUserVo>;
    adminLogin(loginDto: LoginDto): Promise<LoginUserVo>;
    refreshToken(token: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    info(id: number): Promise<UserInfoVo>;
    updatePassword(updatePasswordDto: UpdatePasswordDTO): Promise<"success" | "error">;
    update(updateDto: UpdateUserDto): Promise<"success" | "error">;
    unFreeze(id: number): Promise<string>;
    freeze(id: number): Promise<string>;
    list(pageNumber: number, pageSize: number, username: string, nickName: string, phoneNumber: string, email: string, all?: boolean): Promise<{
        data: import("./entities").User[];
        totalCount: number;
    }>;
    upload(file: Express.Multer.File): Promise<string>;
}

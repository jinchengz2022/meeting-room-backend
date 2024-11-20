"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var UserService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const index_1 = require("./entities/index");
const redis_service_1 = require("../redis/redis.service");
const md5_1 = require("../utils/md5");
const login_vo_1 = require("./vo/login.vo");
let UserService = UserService_1 = class UserService {
    constructor() {
        this.logger = new common_1.Logger();
    }
    async create(user) {
        const captcha = await this.redisService.get(`captcha_${user.email}`);
        if (!captcha) {
            throw new common_1.HttpException('验证码已失效', common_1.HttpStatus.BAD_REQUEST);
        }
        if (user.captcha !== captcha) {
            throw new common_1.HttpException('验证码错误', common_1.HttpStatus.BAD_GATEWAY);
        }
        const foundUser = await this.userRepository.findOneBy({
            username: user.username,
        });
        if (foundUser) {
            throw new common_1.HttpException('该用户名已存在', common_1.HttpStatus.BAD_REQUEST);
        }
        const newUser = new index_1.User();
        newUser.username = user.username;
        newUser.email = user.email;
        newUser.nickName = user.nickName;
        newUser.password = (0, md5_1.md5)(user.password);
        try {
            await this.userRepository.save(newUser);
            return 'success';
        }
        catch (error) {
            this.logger.error(error, UserService_1);
            return 'fail';
        }
    }
    async initData() {
        const user1 = new index_1.User();
        user1.username = 'asdf';
        user1.password = (0, md5_1.md5)('dsiofneo');
        user1.email = 'jinchengz@163.com';
        user1.nickName = 'gggg';
        const user2 = new index_1.User();
        user2.username = 'dddd';
        user2.password = (0, md5_1.md5)('dsiofneo');
        user2.email = 'jinchengz@163.com';
        user2.nickName = 'wwwww';
        const permission1 = new index_1.Permission();
        permission1.code = 'ccc';
        permission1.description = 'ccc 接口权限';
        const permission2 = new index_1.Permission();
        permission2.code = 'aaa';
        permission2.description = 'aaa 接口权限';
        const role1 = new index_1.Role();
        role1.name = '用户';
        const role2 = new index_1.Role();
        role2.name = '管理员';
        user1.roles = [role1];
        user2.roles = [role2];
        role1.permissions = [permission1];
        role2.permissions = [permission1, permission2];
        await this.permissionRepository.save([permission1, permission2]);
        await this.roleRepository.save([role1, role2]);
        await this.userRepository.save([user1, user2]);
    }
    async login(params, isAdmin) {
        const user = await this.userRepository.findOne({
            where: {
                username: params.username,
                isAdmin,
            },
            relations: ['roles', 'roles.permissions'],
        });
        if (!user) {
            throw new common_1.HttpException(isAdmin ? '该管理员账号不存在' : '该账号不存在', common_1.HttpStatus.BAD_REQUEST);
        }
        if (user.password !== (0, md5_1.md5)(params.password)) {
            throw new common_1.HttpException('密码错误', common_1.HttpStatus.BAD_REQUEST);
        }
        const vo = new login_vo_1.LoginUserVo();
        vo.userInfo = {
            id: user.id,
            username: user.username,
            nickName: user.nickName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            headPic: user.headPic,
            createTime: user.createTime.getTime(),
            isFrozen: user.isFrozen,
            isAdmin: user.isAdmin,
            roles: user.roles.map((i) => i.name),
            permissions: user.roles.reduce((arr, item) => {
                item.permissions.forEach((permission) => {
                    if (arr.indexOf(permission) === -1) {
                        arr.push(permission);
                    }
                });
                return arr;
            }, []),
        };
        return vo;
    }
    async findUserById(id, isAdmin) {
        const user = await this.userRepository.findOne({
            where: {
                id,
                isAdmin,
            },
            relations: ['roles', 'roles.permissions'],
        });
        return {
            password: (0, md5_1.md5)(user.password),
            id: user.id,
            username: user.username,
            nickName: user.nickName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            headPic: user.headPic,
            createTime: user.createTime.getTime(),
            isFrozen: user.isFrozen,
            isAdmin: user.isAdmin,
            roles: user.roles.map((i) => i.name),
            permissions: user.roles.reduce((arr, item) => {
                item.permissions.forEach((permission) => {
                    if (arr.indexOf(permission) === -1) {
                        arr.push(permission);
                    }
                });
                return arr;
            }, []),
        };
    }
    async findUserDatailById(id) {
        const data = await this.userRepository.findOne({
            where: {
                id,
            },
        });
        return data;
    }
    async updatePassword(updatePasswordDto) {
        try {
            const code = await this.redisService.get(`update_password_captcha_${updatePasswordDto.email}`);
            if (!code) {
                throw new common_1.HttpException('验证码已失效', common_1.HttpStatus.BAD_REQUEST);
            }
            if (code !== updatePasswordDto.captcha) {
                throw new common_1.HttpException('验证码错误', common_1.HttpStatus.BAD_REQUEST);
            }
            const foundUser = await this.userRepository.findOne({
                where: {
                    id: updatePasswordDto.id,
                },
            });
            foundUser.password = (0, md5_1.md5)(updatePasswordDto.password);
            await this.userRepository.save(foundUser);
            return 'success';
        }
        catch (error) {
            this.logger.error(error, UserService_1);
            return 'error';
        }
    }
    async update(updateDto) {
        try {
            const captcha = await this.redisService.get(`update_captcha_${updateDto.email}`);
            if (!captcha) {
                throw new common_1.HttpException('验证码已失效', common_1.HttpStatus.BAD_REQUEST);
            }
            if (captcha !== updateDto.captcha) {
                throw new common_1.HttpException('验证码错误', common_1.HttpStatus.BAD_REQUEST);
            }
            const foundUser = await this.userRepository.findOne({
                where: {
                    id: updateDto.id,
                },
            });
            foundUser.email = updateDto.email;
            foundUser.username = updateDto.username;
            foundUser.nickName = updateDto.nickName;
            foundUser.headPic = updateDto.headPic;
            await this.userRepository.save(foundUser);
            return 'success';
        }
        catch (error) {
            this.logger.error(error, UserService_1);
            return 'error';
        }
    }
    async freeze(id) {
        const foundUser = await this.userRepository.findOne({
            where: {
                id,
            },
        });
        foundUser.isFrozen = true;
        await this.userRepository.save(foundUser);
    }
    async unFreeze(id) {
        const foundUser = await this.userRepository.findOne({
            where: {
                id,
            },
        });
        foundUser.isFrozen = false;
        await this.userRepository.save(foundUser);
    }
    async findUsersByPage(params) {
        const skipCount = (params.pageNumber - 1) * params.pageSize;
        const condition = {};
        if (params.email) {
            condition.email = (0, typeorm_2.Like)(`%${params.email}%`);
        }
        if (params.username) {
            condition.username = (0, typeorm_2.Like)(`%${params.username}%`);
        }
        if (params.phoneNumber) {
            condition.phoneNumber = (0, typeorm_2.Like)(`%${params.phoneNumber}%`);
        }
        if (params.nickName) {
            condition.phoneNumber = (0, typeorm_2.Like)(`%${params.nickName}%`);
        }
        const [data, totalCount] = await this.userRepository.findAndCount({
            select: [
                'id',
                'updateTime',
                'createTime',
                'email',
                'isFrozen',
                'nickName',
                'phoneNumber',
                'username',
                'headPic'
            ],
            skip: params.all ? undefined : skipCount,
            take: params.all ? undefined : params.pageSize,
            where: condition,
        });
        return { data, totalCount };
    }
};
exports.UserService = UserService;
__decorate([
    (0, typeorm_1.InjectRepository)(index_1.User),
    __metadata("design:type", typeorm_2.Repository)
], UserService.prototype, "userRepository", void 0);
__decorate([
    (0, typeorm_1.InjectRepository)(index_1.Role),
    __metadata("design:type", typeorm_2.Repository)
], UserService.prototype, "roleRepository", void 0);
__decorate([
    (0, typeorm_1.InjectRepository)(index_1.Permission),
    __metadata("design:type", typeorm_2.Repository)
], UserService.prototype, "permissionRepository", void 0);
__decorate([
    (0, common_1.Inject)(redis_service_1.RedisService),
    __metadata("design:type", redis_service_1.RedisService)
], UserService.prototype, "redisService", void 0);
exports.UserService = UserService = UserService_1 = __decorate([
    (0, common_1.Injectable)()
], UserService);
//# sourceMappingURL=user.service.js.map
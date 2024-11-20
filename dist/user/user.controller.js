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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const create_user_dto_1 = require("./dto/create-user.dto");
const update_user_dto_1 = require("./dto/update-user.dto");
const login_dto_1 = require("./dto/login.dto");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const user_info_vo_1 = require("./vo/user-info.vo");
const custom_decrator_1 = require("../custom.decrator");
const update_password_dto_1 = require("./dto/update-password.dto");
const generateParseIntPipe_1 = require("../utils/generateParseIntPipe");
const swagger_1 = require("@nestjs/swagger");
const login_vo_1 = require("./vo/login.vo");
const platform_express_1 = require("@nestjs/platform-express");
const path = require("path");
const my_file_storage_1 = require("../my-file-storage");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async register(createUserDto) {
        return await this.userService.create(createUserDto);
    }
    async init() {
        await this.userService.initData();
        return 'done';
    }
    async login(loginDto) {
        const vo = await this.userService.login(loginDto, false);
        vo.accessToken = this.jwtService.sign({
            userId: vo.userInfo.id,
            username: vo.userInfo.username,
            roles: vo.userInfo.roles,
            permissions: vo.userInfo.permissions,
        }, {
            expiresIn: this.configService.get('jwt_access_token_expires_time') || '30m',
        });
        vo.refreshToken = this.jwtService.sign({
            userId: vo.userInfo.id,
        }, {
            expiresIn: this.configService.get('jwt_refresh_token_expires_time') || '7d',
        });
        return vo;
    }
    async adminLogin(loginDto) {
        const vo = await this.userService.login(loginDto, true);
        vo.accessToken = this.jwtService.sign({
            userId: vo.userInfo.id,
            username: vo.userInfo.username,
            roles: vo.userInfo.roles,
            permissions: vo.userInfo.permissions,
        }, {
            expiresIn: this.configService.get('jwt_access_token_expires_time') || '30m',
        });
        vo.refreshToken = this.jwtService.sign({
            userId: vo.userInfo.id,
        }, {
            expiresIn: this.configService.get('jwt_refresh_token_expires_time') || '7d',
        });
        return vo;
    }
    async refreshToken(token) {
        try {
            const data = this.jwtService.verify(token);
            const user = await this.userService.findUserById(data.userId, false);
            const accessToken = this.jwtService.sign({
                userId: user.id,
                username: user.username,
                roles: user.roles,
                permissions: user.permissions,
            }, {
                expiresIn: this.configService.get('jwt_access_token_expires_time') || '30m',
            });
            const refreshToken = this.jwtService.sign({
                userId: user.id,
                username: user.username,
                roles: user.roles,
                permissions: user.permissions,
            }, {
                expiresIn: this.configService.get('jwt_refresh_token_expires_time') || '7d',
            });
            return {
                accessToken,
                refreshToken,
            };
        }
        catch (error) {
            throw new common_1.UnauthorizedException('token 已失效请重新登录');
        }
    }
    async info(id) {
        const data = await this.userService.findUserDatailById(id);
        const vo = new user_info_vo_1.UserInfoVo();
        vo.username = data.username;
        vo.createTime = data.createTime;
        vo.isFrozen = data.isFrozen;
        vo.email = data.email;
        vo.headPic = data.headPic;
        vo.id = data.id;
        vo.nickName = data.nickName;
        vo.phoneNumber = data.phoneNumber;
        return vo;
    }
    async updatePassword(updatePasswordDto) {
        return this.userService.updatePassword(updatePasswordDto);
    }
    async update(updateDto) {
        return this.userService.update(updateDto);
    }
    async unFreeze(id) {
        this.userService.unFreeze(id);
        return 'success';
    }
    async freeze(id) {
        this.userService.freeze(id);
        return 'success';
    }
    async list(pageNumber, pageSize, username, nickName, phoneNumber, email, all) {
        return this.userService.findUsersByPage({
            pageNumber,
            pageSize,
            username,
            nickName,
            phoneNumber,
            email,
            all
        });
    }
    async upload(file) {
        return file.path;
    }
};
exports.UserController = UserController;
__decorate([
    (0, swagger_1.ApiBody)({
        type: create_user_dto_1.CreateUserDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: '验证码错误',
        type: String,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: '成功',
        type: String,
    }),
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "register", null);
__decorate([
    (0, common_1.Get)('init'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "init", null);
__decorate([
    (0, common_1.Inject)(jwt_1.JwtService),
    __metadata("design:type", jwt_1.JwtService)
], UserController.prototype, "jwtService", void 0);
__decorate([
    (0, common_1.Inject)(config_1.ConfigService),
    __metadata("design:type", config_1.ConfigService)
], UserController.prototype, "configService", void 0);
__decorate([
    (0, swagger_1.ApiBody)({
        type: login_dto_1.LoginDto,
    }),
    (0, swagger_1.ApiResponse)({
        description: '用户名错误',
        status: common_1.HttpStatus.BAD_REQUEST,
    }),
    (0, swagger_1.ApiResponse)({
        type: login_vo_1.LoginUserVo,
        description: 'success',
        status: common_1.HttpStatus.OK,
    }),
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "login", null);
__decorate([
    (0, swagger_1.ApiBody)({
        type: login_dto_1.LoginDto,
    }),
    (0, swagger_1.ApiResponse)({
        description: '用户名错误',
        status: common_1.HttpStatus.BAD_REQUEST,
    }),
    (0, swagger_1.ApiResponse)({
        type: login_vo_1.LoginUserVo,
        description: 'success',
        status: common_1.HttpStatus.OK,
    }),
    (0, common_1.Post)('adminLogin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "adminLogin", null);
__decorate([
    (0, common_1.Get)('refreshToken'),
    __param(0, (0, common_1.Query)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "refreshToken", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiQuery)({
        type: Number,
        description: '',
        name: 'id',
    }),
    (0, swagger_1.ApiResponse)({
        type: user_info_vo_1.UserInfoVo,
        description: 'success',
        status: common_1.HttpStatus.OK,
    }),
    (0, common_1.Get)('info'),
    (0, custom_decrator_1.RequireLogin)(),
    __param(0, (0, common_1.Query)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "info", null);
__decorate([
    (0, swagger_1.ApiBody)({
        type: update_password_dto_1.UpdatePasswordDTO,
    }),
    (0, swagger_1.ApiResponse)({
        description: '密码错误',
        status: common_1.HttpStatus.BAD_REQUEST,
    }),
    (0, swagger_1.ApiResponse)({
        type: String,
        description: 'success',
        status: common_1.HttpStatus.OK,
    }),
    (0, common_1.Post)(['update_password', 'admin/update_password']),
    (0, custom_decrator_1.RequireLogin)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_password_dto_1.UpdatePasswordDTO]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updatePassword", null);
__decorate([
    (0, swagger_1.ApiBody)({
        type: update_user_dto_1.UpdateUserDto,
    }),
    (0, swagger_1.ApiResponse)({
        type: String,
        description: 'success',
        status: common_1.HttpStatus.OK,
    }),
    (0, common_1.Post)(['update', 'admin/update']),
    (0, custom_decrator_1.RequireLogin)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiQuery)({
        type: Number,
        description: '冻结用户',
        name: 'id',
    }),
    (0, swagger_1.ApiResponse)({
        type: String,
        description: 'success',
        status: common_1.HttpStatus.OK,
    }),
    (0, common_1.Get)('unFreeze'),
    __param(0, (0, common_1.Query)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "unFreeze", null);
__decorate([
    (0, swagger_1.ApiQuery)({
        type: Number,
        description: '冻结用户',
        name: 'id',
    }),
    (0, swagger_1.ApiResponse)({
        type: String,
        description: 'success',
        status: common_1.HttpStatus.OK,
    }),
    (0, common_1.Get)('freeze'),
    __param(0, (0, common_1.Query)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "freeze", null);
__decorate([
    (0, swagger_1.ApiQuery)({
        type: Number,
        description: '当前页数',
        name: 'pageNumber',
        required: true,
    }),
    (0, swagger_1.ApiQuery)({
        type: Number,
        description: '每页条数',
        name: 'pageSize',
        required: true,
    }),
    (0, swagger_1.ApiQuery)({
        type: String,
        description: '用户名',
        name: 'username',
        required: false,
    }),
    (0, swagger_1.ApiQuery)({
        type: String,
        description: '昵称',
        name: 'nickName',
        required: false,
    }),
    (0, swagger_1.ApiQuery)({
        type: String,
        description: '电话',
        name: 'phoneNumber',
        required: false,
    }),
    (0, swagger_1.ApiQuery)({
        type: String,
        description: '邮箱',
        name: 'email',
        required: false,
    }),
    (0, swagger_1.ApiResponse)({
        description: 'success',
        status: common_1.HttpStatus.OK,
    }),
    (0, common_1.Get)('list'),
    __param(0, (0, common_1.Query)('pageNumber', new common_1.DefaultValuePipe(1), (0, generateParseIntPipe_1.generateParseIntPipe)('缺失 pageSize'))),
    __param(1, (0, common_1.Query)('pageSize', new common_1.DefaultValuePipe(3), (0, generateParseIntPipe_1.generateParseIntPipe)('缺失 pageSize'))),
    __param(2, (0, common_1.Query)('username')),
    __param(3, (0, common_1.Query)('nickName')),
    __param(4, (0, common_1.Query)('phoneNumber')),
    __param(5, (0, common_1.Query)('email')),
    __param(6, (0, common_1.Query)('all')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String, String, Boolean]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "list", null);
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        dest: 'uploads',
        storage: my_file_storage_1.storage,
        limits: {
            fileSize: 1024 * 1024 * 10
        },
        fileFilter(req, file, callback) {
            const extName = path.extname(file.originalname);
            if (['.png', '.jpg', '.gif', '.pdf'].includes(extName)) {
                callback(null, true);
            }
            else {
                callback(new common_1.BadRequestException('只能上传图片'), false);
            }
        },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "upload", null);
exports.UserController = UserController = __decorate([
    (0, swagger_1.ApiTags)('用户管理模块'),
    (0, common_1.Controller)('user'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map
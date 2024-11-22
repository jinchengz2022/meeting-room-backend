import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Inject,
  UnauthorizedException,
  DefaultValuePipe,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EmailService } from 'src/email/email.service';
import { RedisService } from 'src/redis/redis.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserInfoVo } from './vo/user-info.vo';
import { RequireLogin, UserInfo } from 'src/custom.decrator';
import { UpdatePasswordDTO } from './dto/update-password.dto';
import { generateParseIntPipe } from 'src/utils/generateParseIntPipe';
import {
  ApiBearerAuth,
  ApiBody,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LoginUserVo } from './vo/login.vo';
import { FileInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import { storage } from 'src/my-file-storage';
import { AuthGuard } from '@nestjs/passport';
@ApiTags('用户管理模块')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBody({
    type: CreateUserDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '验证码错误',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '成功',
    type: String,
  })
  @Post('admin-register')
  async adminRegister(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto, true);
  }

  @ApiBody({
    type: CreateUserDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '验证码错误',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '成功',
    type: String,
  })
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @Get('init')
  async init() {
    await this.userService.initData();
    return 'done';
  }

  @Inject(JwtService)
  private jwtService: JwtService;

  @Inject(ConfigService)
  private configService: ConfigService;

  @ApiBody({
    type: LoginDto,
  })
  @ApiResponse({
    description: '用户名错误',
    status: HttpStatus.BAD_REQUEST,
  })
  @ApiResponse({
    type: LoginUserVo,
    description: 'success',
    status: HttpStatus.OK,
  })
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@UserInfo() vo: LoginUserVo) {
    // const vo = await this.userService.login(loginDto, false);

    vo.accessToken = this.jwtService.sign(
      {
        userId: vo.userInfo.id,
        username: vo.userInfo.username,
        roles: vo.userInfo.roles,
        permissions: vo.userInfo.permissions,
      },
      {
        expiresIn:
          this.configService.get('jwt_access_token_expires_time') || '30m',
      },
    );

    vo.refreshToken = this.jwtService.sign(
      {
        userId: vo.userInfo.id,
      },
      {
        expiresIn:
          this.configService.get('jwt_refresh_token_expires_time') || '7d',
      },
    );

    return vo;
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('callback/google')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    if(!req.user) {
      return 'no user from google'
    }

    return {
      message: 'user information from google',
      user: req.user
    }
  }

  @ApiBody({
    type: LoginDto,
  })
  @ApiResponse({
    description: '用户名错误',
    status: HttpStatus.BAD_REQUEST,
  })
  @ApiResponse({
    type: LoginUserVo,
    description: 'success',
    status: HttpStatus.OK,
  })
  @Post('adminLogin')
  async adminLogin(@Body() loginDto: LoginDto) {
    const vo = await this.userService.login(loginDto, true);

    vo.accessToken = this.jwtService.sign(
      {
        userId: vo.userInfo.id,
        username: vo.userInfo.username,
        roles: vo.userInfo.roles,
        permissions: vo.userInfo.permissions,
      },
      {
        expiresIn:
          this.configService.get('jwt_access_token_expires_time') || '30m',
      },
    );

    vo.refreshToken = this.jwtService.sign(
      {
        userId: vo.userInfo.id,
      },
      {
        expiresIn:
          this.configService.get('jwt_refresh_token_expires_time') || '7d',
      },
    );
    return vo;
  }

  @Get('refreshToken')
  async refreshToken(@Query('token') token: string) {
    try {
      const data = this.jwtService.verify(token);

      const user = await this.userService.findUserById(data.userId, false);

      const accessToken = this.jwtService.sign(
        {
          userId: user.id,
          username: user.username,
          roles: user.roles,
          permissions: user.permissions,
        },
        {
          expiresIn:
            this.configService.get('jwt_access_token_expires_time') || '30m',
        },
      );

      const refreshToken = this.jwtService.sign(
        {
          userId: user.id,
          username: user.username,
          roles: user.roles,
          permissions: user.permissions,
        },
        {
          expiresIn:
            this.configService.get('jwt_refresh_token_expires_time') || '7d',
        },
      );

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw new UnauthorizedException('token 已失效请重新登录');
    }
  }

  // @Inject(EmailService)
  // private emailService: EmailService;

  // @Inject(RedisService)
  // private redisService: RedisService;
  // @Get('registerCaptcha')
  // async captcha(@Query('address') address: string) {
  //   const code = Math.random().toString().substring(2, 8);

  //   await this.redisService.set(`captcha_${address}`, code, 5 * 60);

  //   await this.emailService.sendMail({
  //     to: address,
  //     subject: '注册验证码',
  //     html: `<p>您的验证码是；${code}</p>`
  //   })
  // }

  @ApiBearerAuth()
  @ApiQuery({
    type: Number,
    description: '',
    name: 'id',
  })
  @ApiResponse({
    type: UserInfoVo,
    description: 'success',
    status: HttpStatus.OK,
  })
  @Get('info')
  @RequireLogin()
  async info(@Query('id') id: number) {
    const data = await this.userService.findUserDatailById(id);

    const vo = new UserInfoVo();
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

  @ApiBody({
    type: UpdatePasswordDTO,
  })
  @ApiResponse({
    description: '密码错误',
    status: HttpStatus.BAD_REQUEST,
  })
  @ApiResponse({
    type: String,
    description: 'success',
    status: HttpStatus.OK,
  })
  @Post(['update_password', 'admin/update_password'])
  @RequireLogin()
  async updatePassword(@Body() updatePasswordDto: UpdatePasswordDTO) {
    return this.userService.updatePassword(updatePasswordDto);
  }

  @ApiBody({
    type: UpdateUserDto,
  })
  @ApiResponse({
    type: String,
    description: 'success',
    status: HttpStatus.OK,
  })
  @Post(['update', 'admin/update'])
  @RequireLogin()
  async update(@Body() updateDto: UpdateUserDto) {
    return this.userService.update(updateDto);
  }

  @ApiQuery({
    type: Number,
    description: '冻结用户',
    name: 'id',
  })
  @ApiResponse({
    type: String,
    description: 'success',
    status: HttpStatus.OK,
  })
  @Get('unFreeze')
  async unFreeze(@Query('id') id: number) {
    this.userService.unFreeze(id);
    return 'success';
  }

  @ApiQuery({
    type: Number,
    description: '冻结用户',
    name: 'id',
  })
  @ApiResponse({
    type: String,
    description: 'success',
    status: HttpStatus.OK,
  })
  @Get('freeze')
  async freeze(@Query('id') id: number) {
    this.userService.freeze(id);
    return 'success';
  }

  @ApiQuery({
    type: Number,
    description: '当前页数',
    name: 'pageNumber',
    required: true,
  })
  @ApiQuery({
    type: Number,
    description: '每页条数',
    name: 'pageSize',
    required: true,
  })
  @ApiQuery({
    type: String,
    description: '用户名',
    name: 'username',
    required: false,
  })
  @ApiQuery({
    type: String,
    description: '昵称',
    name: 'nickName',
    required: false,
  })
  @ApiQuery({
    type: String,
    description: '电话',
    name: 'phoneNumber',
    required: false,
  })
  @ApiQuery({
    type: String,
    description: '邮箱',
    name: 'email',
    required: false,
  })
  @ApiResponse({
    description: 'success',
    status: HttpStatus.OK,
  })
  @Get('list')
  async list(
    @Query(
      'pageNumber',
      new DefaultValuePipe(1),
      generateParseIntPipe('缺失 pageSize'),
    )
    pageNumber: number,
    @Query(
      'pageSize',
      new DefaultValuePipe(3),
      generateParseIntPipe('缺失 pageSize'),
    )
    pageSize: number,
    @Query('username')
    username: string,
    @Query('nickName')
    nickName: string,
    @Query('phoneNumber')
    phoneNumber: string,
    @Query('email')
    email: string,
    @Query('all')
    all?: boolean
  ) {
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

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      dest: 'uploads',
      storage: storage,
      limits: {
        fileSize: 1024 * 1024 * 10
      },
      fileFilter(req, file, callback) {
        const extName = path.extname(file.originalname);
        if (['.png', '.jpg', '.gif', '.pdf'].includes(extName)) {
          callback(null, true);
        } else {
          callback(new BadRequestException('只能上传图片'), false);
        }
      },
    }),
  )
  async upload(@UploadedFile() file: Express.Multer.File) {
    return file.path;
  }
}

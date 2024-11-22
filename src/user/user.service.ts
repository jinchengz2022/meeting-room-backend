import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { User, Permission, Role } from './entities/index';
import { RedisService } from 'src/redis/redis.service';
import { md5 } from 'src/utils/md5';
import { LoginDto } from './dto/login.dto';
import { LoginUserVo } from './vo/login.vo';
import { UpdatePasswordDTO } from './dto/update-password.dto';

@Injectable()
export class UserService {
  private logger = new Logger();

  @InjectRepository(User)
  private userRepository: Repository<User>;

  @InjectRepository(Role)
  private roleRepository: Repository<Role>;

  @InjectRepository(Permission)
  private permissionRepository: Repository<Permission>;

  @Inject(RedisService)
  private redisService: RedisService;

  async create(user: CreateUserDto, isAdmin?: boolean) {
    const captcha = await this.redisService.get(`captcha_${user.email}`);
    
    if (!captcha) {
      throw new HttpException('验证码已失效', HttpStatus.BAD_REQUEST);
    }

    if (user.captcha !== captcha) {
      throw new HttpException('验证码错误', HttpStatus.BAD_GATEWAY);
    }

    const foundUser = await this.userRepository.findOneBy({
      username: user.username,
    });

    if (foundUser) {
      throw new HttpException('该用户名已存在', HttpStatus.BAD_REQUEST);
    }

    await this.redisService.delete(`captcha_${user.email}`);

    const newUser = new User();
    newUser.username = user.username;
    newUser.email = user.email;
    newUser.nickName = user.nickName;
    newUser.password = md5(user.password);
    newUser.isAdmin = isAdmin ? true : false;

    try {
      await this.userRepository.save(newUser);
      return 'success';
    } catch (error) {
      this.logger.error(error, UserService);
      return 'fail';
    }
  }

  async initData() {
    const user1 = new User();
    user1.username = 'lina';
    user1.password = md5('123');
    user1.email = 'jinchengz@163.com';
    user1.nickName = 'gggg';
    user1.isAdmin = true;

    const user2 = new User();
    user2.username = 'zhangna';
    user2.password = md5('123');
    user2.email = 'jinchengz@163.com';
    user2.nickName = 'wwwww';

    const permission1 = new Permission();
    permission1.code = 'ccc';
    permission1.description = 'ccc 接口权限';

    const permission2 = new Permission();
    permission2.code = 'aaa';
    permission2.description = 'aaa 接口权限';

    const role1 = new Role();
    role1.name = '用户';

    const role2 = new Role();
    role2.name = '管理员';

    user1.roles = [role1];
    user2.roles = [role2];

    role1.permissions = [permission1];
    role2.permissions = [permission1, permission2];

    await this.permissionRepository.save([permission1, permission2]);
    await this.roleRepository.save([role1, role2]);
    await this.userRepository.save([user1, user2]);
  }

  async login(params: LoginDto, isAdmin: boolean) {
    const user = await this.userRepository.findOne({
      where: {
        username: params.username,
        isAdmin,
      },
      relations: ['roles', 'roles.permissions'],
    });

    if (!user) {
      throw new HttpException(isAdmin ? '该管理员账号不存在' : '该账号不存在', HttpStatus.BAD_REQUEST);
    }

    if (user.password !== md5(params.password)) {
      throw new HttpException('密码错误', HttpStatus.BAD_REQUEST);
    }

    const vo = new LoginUserVo();
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

  async findUserById(id: number, isAdmin: boolean) {
    const user = await this.userRepository.findOne({
      where: {
        id,
        isAdmin,
      },
      relations: ['roles', 'roles.permissions'],
    });

    return {
      password: md5(user.password),
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

  async findUserDatailById(id: number) {
    const data = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    return data;
  }

  async updatePassword(updatePasswordDto: UpdatePasswordDTO) {
    try {
      const code = await this.redisService.get(
        `update_password_captcha_${updatePasswordDto.email}`,
      );

      if (!code) {
        throw new HttpException('验证码已失效', HttpStatus.BAD_REQUEST);
      }

      if (code !== updatePasswordDto.captcha) {
        throw new HttpException('验证码错误', HttpStatus.BAD_REQUEST);
      }

      const foundUser = await this.userRepository.findOne({
        where: {
          id: updatePasswordDto.id,
        },
      });

      foundUser.password = md5(updatePasswordDto.password);

      await this.userRepository.save(foundUser);
      return 'success';
    } catch (error) {
      this.logger.error(error, UserService);

      return 'error';
    }
  }

  async update(updateDto: UpdateUserDto) {
      // const captcha = await this.redisService.get(
      //   `update_captcha_${updateDto.email}`,
      // );

      // if (!captcha) {
      //   throw new BadRequestException('验证码已失效');
      // }

      // if (captcha !== updateDto.captcha) {
      //   throw new BadRequestException('验证码错误');
      // }

      const foundUser = await this.userRepository.findOne({
        where: {
          id: updateDto.id,
        },
      });

      foundUser.email = updateDto.email;
      foundUser.username = updateDto.username;
      foundUser.nickName = updateDto.nickName;
      foundUser.headPic = updateDto.headPic;

    try {
      await this.userRepository.save(foundUser);
      return 'success';
    } catch (error) {
      this.logger.error(error, UserService);
      return 'error';
    }
  }

  async freeze(id: number) {
    const foundUser = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    foundUser.isFrozen = true;

    await this.userRepository.save(foundUser);
  }

  async unFreeze(id: number) {
    const foundUser = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    foundUser.isFrozen = false;

    await this.userRepository.save(foundUser);
  }

  async findUsersByPage(params: {
    pageNumber: number;
    pageSize: number;
    email?: string;
    username?: string;
    nickName?: string;
    phoneNumber?: string;
    all?: boolean
  }) {
    const skipCount = (params.pageNumber - 1) * params.pageSize;

    const condition: Record<string, any> = {};

    if (params.email) {
      condition.email = Like(`%${params.email}%`);
    }

    if (params.username) {
      condition.username = Like(`%${params.username}%`);
    }

    if (params.phoneNumber) {
      condition.phoneNumber = Like(`%${params.phoneNumber}%`);
    }

    if (params.nickName) {
      condition.phoneNumber = Like(`%${params.nickName}%`);
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
}

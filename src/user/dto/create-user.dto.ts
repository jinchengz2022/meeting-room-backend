import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty({
        message: '用户名不能为空'
    })
    @ApiProperty()
    username: string;

    @IsNotEmpty({
        message: '密码不能为空'
    })
    @ApiProperty()
    password: string;


    // @IsNotEmpty({
    //     message: '昵称不能为空'
    // })
    @ApiProperty()
    nickName: string;

    @IsNotEmpty({
        message: '邮箱不能为空'
    })
    @ApiProperty()
    email: string;

    @ApiProperty()
    captcha: string;
}

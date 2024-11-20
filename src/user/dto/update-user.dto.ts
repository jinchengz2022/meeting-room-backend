import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
    @IsNotEmpty({
        message: ''
    })
    @ApiProperty()
    id: number;

    @IsNotEmpty({
        message: '用户名不能为空'
    })
    @ApiProperty()
    username: string;


    @IsNotEmpty({
        message: '邮箱不能为空'
    })
    @ApiProperty()
    email: string;

    @IsNotEmpty({
        message: '验证码不能为空'
    })
    @ApiProperty()
    captcha: string;

    @ApiProperty()
    nickName: string;

    @ApiProperty()
    headPic: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdatePasswordDTO {
    @IsNotEmpty({
        message: ''
    })
    @ApiProperty()
    id: number;

    @IsNotEmpty({
        message: '密码不能为空'
    })
    @ApiProperty()
    password: string;

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
}
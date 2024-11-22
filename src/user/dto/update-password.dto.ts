import { PickType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { LoginDto } from './login.dto';

export class UpdatePasswordDTO extends PickType(LoginDto, ['username', 'password']) {
    @IsNotEmpty({
        message: ''
    })
    @ApiProperty()
    id: number;

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
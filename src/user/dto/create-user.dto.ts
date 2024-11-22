import { PickType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { LoginDto } from './login.dto';

export class CreateUserDto extends PickType(LoginDto, ['username', 'password']){
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

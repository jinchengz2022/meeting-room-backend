import { IsNotEmpty, MinLength} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateMeetingRoomDto {
    @IsNotEmpty({
        message: '会议室名称不能为空'
    })
    @ApiProperty()
    name: string;

    @IsNotEmpty({
        message: '会议室容量不能为空'
    })
    @ApiProperty()
    capacity: number;

    @IsNotEmpty({
        message: '会议室位置不能为空'
    })
    @ApiProperty()
    position: string;

    desc?: string;
}
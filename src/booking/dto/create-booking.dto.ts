import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'

export class CreateBookingDto {
    @IsNotEmpty({
        message: '会议室名称不能为空'
    })
    @ApiProperty()
    roomName: string;

    @IsNotEmpty({
        message: '用户id'
    })
    @ApiProperty()
    id: number;

    @IsNotEmpty({
        message: '预定位置不能为空'
    })
    @ApiProperty()
    position: string;

    @IsNotEmpty({
        message: '开始时间不能为空'
    })
    @ApiProperty()
    startTime: Date;

    @IsNotEmpty({
        message: '结束时间不能为空'
    })
    @ApiProperty()
    endTime: Date;

    @IsNotEmpty({
        message: '参会人员不能为空'
    })
    @ApiProperty()
    people: number[];
}

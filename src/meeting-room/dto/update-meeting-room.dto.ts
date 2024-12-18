import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateMeetingRoomDto } from './create-meeting-room.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateMeetingRoomDto extends CreateMeetingRoomDto {
    @IsNotEmpty({
        message: 'id不能为空'
    })
    @ApiProperty()
    id: number;
}

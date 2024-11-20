import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  DefaultValuePipe,
} from '@nestjs/common';
import { MeetingRoomService } from './meeting-room.service';
import { CreateMeetingRoomDto } from './dto/create-meeting-room.dto';
import { UpdateMeetingRoomDto } from './dto/update-meeting-room.dto';
import { generateParseIntPipe } from 'src/utils/generateParseIntPipe';

@Controller('meeting-room')
export class MeetingRoomController {
  constructor(private readonly meetingRoomService: MeetingRoomService) {}

  @Get('init')
  async init() {
    await this.meetingRoomService.init();
    return 'success';
  }

  @Get('list')
  async list(
    @Query(
      'pageNumber',
      new DefaultValuePipe(1),
      generateParseIntPipe('缺少 pageNumber'),
    )
    pageNumber: number,
    @Query(
      'pageSize',
      new DefaultValuePipe(3),
      generateParseIntPipe('缺少 pageNumber'),
    )
    pageSize: number,
    @Query('capacity')
    capacity?: number,
    @Query('name')
    name?: string,
    @Query('position')
    position?: string,
  ) {
    const res = await this.meetingRoomService.list({
      pageNumber,
      pageSize,
      capacity,
      name,
      position,
    });

    return res;
  }

  @Post('CreateMeetingRoom')
  createMeetingRoom(@Body() params: CreateMeetingRoomDto) {
    return this.meetingRoomService.createMeetingRoom(params);
  }

  @Get('DeleteMeetingRoom')
  deleteMeetingRoom(@Query('id') id: number) {
    return this.meetingRoomService.deleteMeetingRoom(id);
  }

  @Post('UpdateMeetingRoom')
  updateMeetingRoom(@Body() params: UpdateMeetingRoomDto) {
    return this.meetingRoomService.updateMeetingRoom(params);
  }

  @Get('GetMeetingRoom')
  getMeetingRoom(
    @Query('id') id: number,
  ) {
    return this.meetingRoomService.getMeetingRoom(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.meetingRoomService.remove(+id);
  }
}

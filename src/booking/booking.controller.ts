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
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { generateParseIntPipe } from 'src/utils/generateParseIntPipe';
import { RequireLogin } from 'src/custom.decrator';
import { UserInfoVo } from 'src/user/vo/user-info.vo';
import { UserModule } from 'src/user/user.module';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get('init')
  init() {
    return this.bookingService.init();
  }

  @Get('list')
  list(
    @Query(
      'pageNumber',
      new DefaultValuePipe(1),
      generateParseIntPipe('缺少 pageNumber'),
    )
    pageNumber: number,
    @Query(
      'pageSize',
      new DefaultValuePipe(3),
      generateParseIntPipe('缺少 pageSize'),
    )
    pageSize: number,
    @Query('userName') userName: string,
    @Query('roomName') roomName: string,
    @Query('position') position: string,
  ) {
    return this.bookingService.list({
      pageNumber,
      pageSize,
      position,
      userName,
      roomName,
    });
  }

  @Post('add')
  @RequireLogin()
  add(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingService.add(createBookingDto);
  }

  @Get('apply/:id')
  apply(@Param('id') id: number) {
    return this.bookingService.apply(id);
  }

  @Get('reject/:id')
  reject(@Param('id') id: number) {
    return this.bookingService.reject(id);
  }

  @Get('unbind/:id')
  unbind(@Param('id') id: number) {
    return this.bookingService.unbind(id);
  }
}

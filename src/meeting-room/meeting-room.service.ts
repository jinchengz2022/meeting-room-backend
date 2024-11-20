import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { CreateMeetingRoomDto } from './dto/create-meeting-room.dto';
import { UpdateMeetingRoomDto } from './dto/update-meeting-room.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MeetingRoom } from './entities/meeting-room.entity';
import { Like, Repository } from 'typeorm';

@Injectable()
export class MeetingRoomService {
  @InjectRepository(MeetingRoom)
  private meetingRoomRepository: Repository<MeetingRoom>;

  async init() {
    const data1 = new MeetingRoom();
    data1.capacity = 10;
    data1.name = '云南';
    data1.position = '1-1';

    const data2 = new MeetingRoom();
    data2.capacity = 6;
    data2.name = '山东';
    data2.position = '3-1';

    const data3 = new MeetingRoom();
    data3.capacity = 10;
    data3.name = '北京';
    data3.position = '9-1';

    await this.meetingRoomRepository.save([data1, data2, data3]);
  }

  async list(params: {
    pageNumber: number;
    pageSize: number;
    capacity?: number;
    name?: string;
    position?: string;
  }) {
    const skipCount = (params.pageNumber - 1) * params.pageSize;
    const condition: Record<string, any> = {};

    if (params.capacity) {
      condition.capacity = Like(`%${params.capacity}%`);
    }
    if (params.name) {
      condition.name = Like(`%${params.name}%`);
    }
    if (params.position) {
      condition.position = Like(`%${params.position}%`);
    }

    const [data, totalCount] = await this.meetingRoomRepository.findAndCount({
      take: params.pageSize,
      where: condition,
      skip: skipCount,
      select: ['capacity', 'desc', 'isBooked', 'name', 'position', 'id'],
      order: { createTime: 'DESC'},
    });

    return { data, totalCount };
  }

  async createMeetingRoom(params: CreateMeetingRoomDto) {
    const room = await this.meetingRoomRepository.findOneBy({
      name: params.name,
    });

    if (room) {
      throw new BadRequestException('该会议室名称已存在');
    }

    const newRoom = new MeetingRoom();

    newRoom.capacity = params.capacity;
    newRoom.desc = params.desc;
    newRoom.name = params.name;
    newRoom.position = params.position;

    try {
      await this.meetingRoomRepository.save(newRoom);
      return 'success';
    } catch (error) {
      return 'fail';
    }
  }

  async updateMeetingRoom(params: UpdateMeetingRoomDto) {
    const data = await this.meetingRoomRepository.findOneBy({
      id: params.id,
    });

    if (!data) {
      throw new BadRequestException('该会议室不存在');
    }

    if (params.capacity) {
      data.capacity = params.capacity;
    }
    if (params.desc) {
      data.desc = params.desc;
    }
    if (params.name) {
      data.name = params.name;
    }
    if (params.position) {
      data.position = params.position;
    }

    try {
      await this.meetingRoomRepository.update(
        {
          id: data.id,
        },
        data,
      );
      return 'success';
    } catch (error) {
      return 'fail';
    }
  }

  async deleteMeetingRoom(id: number) {
    const data = await this.meetingRoomRepository.findOne({
      where: {
        id: id,
      },
    });

    try {
      await this.meetingRoomRepository.delete(id);
      return 'success';
    } catch (error) {
      return 'fail';
    }
  }

  async getMeetingRoom(id: number) {
    const data = await this.meetingRoomRepository.findOne({
      where: { id },
    });

    if (!data) {
      return '该会议室不存在';
    }
    return data;
  }

  update(id: number, updateMeetingRoomDto: UpdateMeetingRoomDto) {
    return `This action updates a #${id} meetingRoom`;
  }

  remove(id: number) {
    return `This action removes a #${id} meetingRoom`;
  }
}

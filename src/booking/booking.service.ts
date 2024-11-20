import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { EntityManager, LessThanOrEqual, Like, MoreThanOrEqual } from 'typeorm';
import { User } from 'src/user/entities';
import { MeetingRoom } from 'src/meeting-room/entities/meeting-room.entity';

@Injectable()
export class BookingService {
  @InjectEntityManager()
  private entityManager: EntityManager;

  async init() {
    const user1 = await this.entityManager.findOneBy(User, {
      id: 18,
    });
    const user2 = await this.entityManager.findOneBy(User, {
      id: 19,
    });
    const room1 = await this.entityManager.findOneBy(MeetingRoom, {
      id: 7,
    });
    const room2 = await this.entityManager.findOneBy(MeetingRoom, {
      id: 8,
    });

    const booking1 = new Booking();
    booking1.user = user1;
    booking1.room = room1;
    booking1.startTime = new Date();
    booking1.endTime = new Date(Date.now() + 1000 * 60 * 60);
    await this.entityManager.save(Booking, booking1);

    const booking2 = new Booking();
    booking2.user = user2;
    booking2.room = room2;
    booking2.startTime = new Date();
    booking2.endTime = new Date(Date.now() + 1000 * 60 * 60);
    await this.entityManager.save(Booking, booking2);

    const booking3 = new Booking();
    booking3.user = user2;
    booking3.room = room1;
    booking3.startTime = new Date();
    booking3.endTime = new Date(Date.now() + 1000 * 60 * 60);
    await this.entityManager.save(Booking, booking3);
  }

  async list(params: {
    pageNumber: number;
    pageSize: number;
    userName?: string;
    roomName?: string;
    position?: string;
  }) {
    const skipCount = (params.pageNumber - 1) * params.pageSize;
    const condition: Record<string, any> = { user: {}, room: {} };

    if (params.position) {
      condition.room.position = Like(`%${params.position}%`);
    }
    if (params.userName) {
      condition.user.username = Like(`%${params.userName}%`);
    }
    if (params.roomName) {
      condition.room.name = Like(`%${params.roomName}%`);
    }

    const [res, totalCount] = await this.entityManager.findAndCount(Booking, {
      where: condition,
      take: params.pageSize,
      skip: skipCount,
      order: { id: 'DESC' },
      relations: { user: true, room: true },
      // select: {
      //   id: true,
      //   user: {
      //     username: true
      //   }
      // }
    });

    const data = res.map((i) => ({
      userName: i.user.username,
      roomName: i.room.name,
      position: i.room.position,
      roomId: i.room.id,
      ...i,
      user: undefined,
      room: undefined,
    }));

    return { data, totalCount };
  }

  async add(params: CreateBookingDto) {
    const user = await this.entityManager.findOneBy(User, { id: params.id });
    const room = await this.entityManager.findOneBy(MeetingRoom, {
      name: params.roomName,
    });

    if (!room) {
      throw new BadRequestException('该会议室不存在');
    }

    const booking = new Booking();
    booking.user = user;
    booking.room = room;
    booking.startTime = new Date(params.startTime);
    booking.endTime = new Date(params.endTime);
    booking.people = params.people;

    const res = await this.entityManager.findOneBy(Booking, {
      startTime: LessThanOrEqual(booking.startTime),
      endTime: MoreThanOrEqual(booking.endTime),
      room: {
        id: room.id
      },
    });

    if (res) {
      throw new BadRequestException('该时段会议室已被预定');
    }

    await this.entityManager.save(Booking, booking);
    return 'success';
  }

  async apply(id: number) {
    await this.entityManager.update(
      Booking,
      {
        id,
      },
      { status: 'done' },
    );
    return `success`;
  }

  async reject(id: number) {
    await this.entityManager.update(
      Booking,
      {
        id,
      },
      { status: 'reject' },
    );
    return `success`;
  }

  async unbind(id: number) {
    await this.entityManager.update(
      Booking,
      {
        id,
      },
      { status: 'waiting' },
    );
    return `success`;
  }
}

import { MeetingRoom } from '../../meeting-room/entities/meeting-room.entity';
import { User } from '../../user/entities';
import {
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn({
    comment: '预定id',
  })
  id: number;

  @CreateDateColumn({
    comment: '会议开始时间',
  })
  startTime: Date;

  @UpdateDateColumn({
    comment: '会议结束时间',
  })
  endTime: Date;

  @Column({
    comment: '会议室状态',
    default: 'applying',
  })
  status: string;

  @Column({
    comment: '备注',
    default: '',
  })
  note: string;

  @Column('simple-array')
  people: number[];

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => MeetingRoom)
  room: MeetingRoom;
}

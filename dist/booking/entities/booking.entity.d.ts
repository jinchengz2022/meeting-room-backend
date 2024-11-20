import { MeetingRoom } from 'src/meeting-room/entities/meeting-room.entity';
import { User } from 'src/user/entities';
export declare class Booking {
    id: number;
    startTime: Date;
    endTime: Date;
    status: string;
    note: string;
    people: number[];
    user: User;
    room: MeetingRoom;
}

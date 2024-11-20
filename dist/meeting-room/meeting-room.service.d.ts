import { CreateMeetingRoomDto } from './dto/create-meeting-room.dto';
import { UpdateMeetingRoomDto } from './dto/update-meeting-room.dto';
import { MeetingRoom } from './entities/meeting-room.entity';
export declare class MeetingRoomService {
    private meetingRoomRepository;
    init(): Promise<void>;
    list(params: {
        pageNumber: number;
        pageSize: number;
        capacity?: number;
        name?: string;
        position?: string;
    }): Promise<{
        data: MeetingRoom[];
        totalCount: number;
    }>;
    createMeetingRoom(params: CreateMeetingRoomDto): Promise<"success" | "fail">;
    updateMeetingRoom(params: UpdateMeetingRoomDto): Promise<"success" | "fail">;
    deleteMeetingRoom(id: number): Promise<"success" | "fail">;
    getMeetingRoom(id: number): Promise<MeetingRoom | "该会议室不存在">;
    update(id: number, updateMeetingRoomDto: UpdateMeetingRoomDto): string;
    remove(id: number): string;
}

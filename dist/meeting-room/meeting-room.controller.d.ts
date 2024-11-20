import { MeetingRoomService } from './meeting-room.service';
import { CreateMeetingRoomDto } from './dto/create-meeting-room.dto';
import { UpdateMeetingRoomDto } from './dto/update-meeting-room.dto';
export declare class MeetingRoomController {
    private readonly meetingRoomService;
    constructor(meetingRoomService: MeetingRoomService);
    init(): Promise<string>;
    list(pageNumber: number, pageSize: number, capacity?: number, name?: string, position?: string): Promise<{
        data: import("./entities/meeting-room.entity").MeetingRoom[];
        totalCount: number;
    }>;
    createMeetingRoom(params: CreateMeetingRoomDto): Promise<"success" | "fail">;
    deleteMeetingRoom(id: number): Promise<"success" | "fail">;
    updateMeetingRoom(params: UpdateMeetingRoomDto): Promise<"success" | "fail">;
    getMeetingRoom(id: number): Promise<import("./entities/meeting-room.entity").MeetingRoom | "该会议室不存在">;
    remove(id: string): string;
}

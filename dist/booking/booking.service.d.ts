import { CreateBookingDto } from './dto/create-booking.dto';
export declare class BookingService {
    private entityManager;
    init(): Promise<void>;
    list(params: {
        pageNumber: number;
        pageSize: number;
        userName?: string;
        roomName?: string;
        position?: string;
    }): Promise<{
        data: {
            user: any;
            room: any;
            id: number;
            startTime: Date;
            endTime: Date;
            status: string;
            note: string;
            people: number[];
            userName: string;
            roomName: string;
            position: string;
            roomId: number;
        }[];
        totalCount: number;
    }>;
    add(params: CreateBookingDto): Promise<string>;
    apply(id: number): Promise<string>;
    reject(id: number): Promise<string>;
    unbind(id: number): Promise<string>;
}

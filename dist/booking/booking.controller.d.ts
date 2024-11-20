import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
export declare class BookingController {
    private readonly bookingService;
    constructor(bookingService: BookingService);
    init(): Promise<void>;
    list(pageNumber: number, pageSize: number, userName: string, roomName: string, position: string): Promise<{
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
    add(createBookingDto: CreateBookingDto): Promise<string>;
    apply(id: number): Promise<string>;
    reject(id: number): Promise<string>;
    unbind(id: number): Promise<string>;
}

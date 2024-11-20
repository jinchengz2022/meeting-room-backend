"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const booking_entity_1 = require("./entities/booking.entity");
const typeorm_2 = require("typeorm");
const entities_1 = require("../user/entities");
const meeting_room_entity_1 = require("../meeting-room/entities/meeting-room.entity");
let BookingService = class BookingService {
    async init() {
        const user1 = await this.entityManager.findOneBy(entities_1.User, {
            id: 18,
        });
        const user2 = await this.entityManager.findOneBy(entities_1.User, {
            id: 19,
        });
        const room1 = await this.entityManager.findOneBy(meeting_room_entity_1.MeetingRoom, {
            id: 7,
        });
        const room2 = await this.entityManager.findOneBy(meeting_room_entity_1.MeetingRoom, {
            id: 8,
        });
        const booking1 = new booking_entity_1.Booking();
        booking1.user = user1;
        booking1.room = room1;
        booking1.startTime = new Date();
        booking1.endTime = new Date(Date.now() + 1000 * 60 * 60);
        await this.entityManager.save(booking_entity_1.Booking, booking1);
        const booking2 = new booking_entity_1.Booking();
        booking2.user = user2;
        booking2.room = room2;
        booking2.startTime = new Date();
        booking2.endTime = new Date(Date.now() + 1000 * 60 * 60);
        await this.entityManager.save(booking_entity_1.Booking, booking2);
        const booking3 = new booking_entity_1.Booking();
        booking3.user = user2;
        booking3.room = room1;
        booking3.startTime = new Date();
        booking3.endTime = new Date(Date.now() + 1000 * 60 * 60);
        await this.entityManager.save(booking_entity_1.Booking, booking3);
    }
    async list(params) {
        const skipCount = (params.pageNumber - 1) * params.pageSize;
        const condition = { user: {}, room: {} };
        if (params.position) {
            condition.room.position = (0, typeorm_2.Like)(`%${params.position}%`);
        }
        if (params.userName) {
            condition.user.username = (0, typeorm_2.Like)(`%${params.userName}%`);
        }
        if (params.roomName) {
            condition.room.name = (0, typeorm_2.Like)(`%${params.roomName}%`);
        }
        const [res, totalCount] = await this.entityManager.findAndCount(booking_entity_1.Booking, {
            where: condition,
            take: params.pageSize,
            skip: skipCount,
            order: { id: 'DESC' },
            relations: { user: true, room: true },
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
    async add(params) {
        const user = await this.entityManager.findOneBy(entities_1.User, { id: params.id });
        const room = await this.entityManager.findOneBy(meeting_room_entity_1.MeetingRoom, {
            name: params.roomName,
        });
        if (!room) {
            throw new common_1.BadRequestException('该会议室不存在');
        }
        const booking = new booking_entity_1.Booking();
        booking.user = user;
        booking.room = room;
        booking.startTime = new Date(params.startTime);
        booking.endTime = new Date(params.endTime);
        booking.people = params.people;
        const res = await this.entityManager.findOneBy(booking_entity_1.Booking, {
            startTime: (0, typeorm_2.LessThanOrEqual)(booking.startTime),
            endTime: (0, typeorm_2.MoreThanOrEqual)(booking.endTime),
            room: {
                id: room.id
            },
        });
        if (res) {
            throw new common_1.BadRequestException('该时段会议室已被预定');
        }
        await this.entityManager.save(booking_entity_1.Booking, booking);
        return 'success';
    }
    async apply(id) {
        await this.entityManager.update(booking_entity_1.Booking, {
            id,
        }, { status: 'done' });
        return `success`;
    }
    async reject(id) {
        await this.entityManager.update(booking_entity_1.Booking, {
            id,
        }, { status: 'reject' });
        return `success`;
    }
    async unbind(id) {
        await this.entityManager.update(booking_entity_1.Booking, {
            id,
        }, { status: 'waiting' });
        return `success`;
    }
};
exports.BookingService = BookingService;
__decorate([
    (0, typeorm_1.InjectEntityManager)(),
    __metadata("design:type", typeorm_2.EntityManager)
], BookingService.prototype, "entityManager", void 0);
exports.BookingService = BookingService = __decorate([
    (0, common_1.Injectable)()
], BookingService);
//# sourceMappingURL=booking.service.js.map
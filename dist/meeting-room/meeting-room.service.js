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
exports.MeetingRoomService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const meeting_room_entity_1 = require("./entities/meeting-room.entity");
const typeorm_2 = require("typeorm");
let MeetingRoomService = class MeetingRoomService {
    async init() {
        const data1 = new meeting_room_entity_1.MeetingRoom();
        data1.capacity = 10;
        data1.name = '云南';
        data1.position = '1-1';
        const data2 = new meeting_room_entity_1.MeetingRoom();
        data2.capacity = 6;
        data2.name = '山东';
        data2.position = '3-1';
        const data3 = new meeting_room_entity_1.MeetingRoom();
        data3.capacity = 10;
        data3.name = '北京';
        data3.position = '9-1';
        await this.meetingRoomRepository.save([data1, data2, data3]);
    }
    async list(params) {
        const skipCount = (params.pageNumber - 1) * params.pageSize;
        const condition = {};
        if (params.capacity) {
            condition.capacity = (0, typeorm_2.Like)(`%${params.capacity}%`);
        }
        if (params.name) {
            condition.name = (0, typeorm_2.Like)(`%${params.name}%`);
        }
        if (params.position) {
            condition.position = (0, typeorm_2.Like)(`%${params.position}%`);
        }
        const [data, totalCount] = await this.meetingRoomRepository.findAndCount({
            take: params.pageSize,
            where: condition,
            skip: skipCount,
            select: ['capacity', 'desc', 'isBooked', 'name', 'position', 'id'],
            order: { createTime: 'DESC' },
        });
        return { data, totalCount };
    }
    async createMeetingRoom(params) {
        const room = await this.meetingRoomRepository.findOneBy({
            name: params.name,
        });
        if (room) {
            throw new common_1.BadRequestException('该会议室名称已存在');
        }
        const newRoom = new meeting_room_entity_1.MeetingRoom();
        newRoom.capacity = params.capacity;
        newRoom.desc = params.desc;
        newRoom.name = params.name;
        newRoom.position = params.position;
        try {
            await this.meetingRoomRepository.save(newRoom);
            return 'success';
        }
        catch (error) {
            return 'fail';
        }
    }
    async updateMeetingRoom(params) {
        const data = await this.meetingRoomRepository.findOneBy({
            id: params.id,
        });
        if (!data) {
            throw new common_1.BadRequestException('该会议室不存在');
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
            await this.meetingRoomRepository.update({
                id: data.id,
            }, data);
            return 'success';
        }
        catch (error) {
            return 'fail';
        }
    }
    async deleteMeetingRoom(id) {
        const data = await this.meetingRoomRepository.findOne({
            where: {
                id: id,
            },
        });
        try {
            await this.meetingRoomRepository.delete(id);
            return 'success';
        }
        catch (error) {
            return 'fail';
        }
    }
    async getMeetingRoom(id) {
        const data = await this.meetingRoomRepository.findOne({
            where: { id },
        });
        if (!data) {
            return '该会议室不存在';
        }
        return data;
    }
    update(id, updateMeetingRoomDto) {
        return `This action updates a #${id} meetingRoom`;
    }
    remove(id) {
        return `This action removes a #${id} meetingRoom`;
    }
};
exports.MeetingRoomService = MeetingRoomService;
__decorate([
    (0, typeorm_1.InjectRepository)(meeting_room_entity_1.MeetingRoom),
    __metadata("design:type", typeorm_2.Repository)
], MeetingRoomService.prototype, "meetingRoomRepository", void 0);
exports.MeetingRoomService = MeetingRoomService = __decorate([
    (0, common_1.Injectable)()
], MeetingRoomService);
//# sourceMappingURL=meeting-room.service.js.map
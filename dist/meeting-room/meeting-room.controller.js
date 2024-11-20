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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeetingRoomController = void 0;
const common_1 = require("@nestjs/common");
const meeting_room_service_1 = require("./meeting-room.service");
const create_meeting_room_dto_1 = require("./dto/create-meeting-room.dto");
const update_meeting_room_dto_1 = require("./dto/update-meeting-room.dto");
const generateParseIntPipe_1 = require("../utils/generateParseIntPipe");
let MeetingRoomController = class MeetingRoomController {
    constructor(meetingRoomService) {
        this.meetingRoomService = meetingRoomService;
    }
    async init() {
        await this.meetingRoomService.init();
        return 'success';
    }
    async list(pageNumber, pageSize, capacity, name, position) {
        const res = await this.meetingRoomService.list({
            pageNumber,
            pageSize,
            capacity,
            name,
            position,
        });
        return res;
    }
    createMeetingRoom(params) {
        return this.meetingRoomService.createMeetingRoom(params);
    }
    deleteMeetingRoom(id) {
        return this.meetingRoomService.deleteMeetingRoom(id);
    }
    updateMeetingRoom(params) {
        return this.meetingRoomService.updateMeetingRoom(params);
    }
    getMeetingRoom(id) {
        return this.meetingRoomService.getMeetingRoom(id);
    }
    remove(id) {
        return this.meetingRoomService.remove(+id);
    }
};
exports.MeetingRoomController = MeetingRoomController;
__decorate([
    (0, common_1.Get)('init'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MeetingRoomController.prototype, "init", null);
__decorate([
    (0, common_1.Get)('list'),
    __param(0, (0, common_1.Query)('pageNumber', new common_1.DefaultValuePipe(1), (0, generateParseIntPipe_1.generateParseIntPipe)('缺少 pageNumber'))),
    __param(1, (0, common_1.Query)('pageSize', new common_1.DefaultValuePipe(3), (0, generateParseIntPipe_1.generateParseIntPipe)('缺少 pageNumber'))),
    __param(2, (0, common_1.Query)('capacity')),
    __param(3, (0, common_1.Query)('name')),
    __param(4, (0, common_1.Query)('position')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number, String, String]),
    __metadata("design:returntype", Promise)
], MeetingRoomController.prototype, "list", null);
__decorate([
    (0, common_1.Post)('CreateMeetingRoom'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_meeting_room_dto_1.CreateMeetingRoomDto]),
    __metadata("design:returntype", void 0)
], MeetingRoomController.prototype, "createMeetingRoom", null);
__decorate([
    (0, common_1.Get)('DeleteMeetingRoom'),
    __param(0, (0, common_1.Query)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], MeetingRoomController.prototype, "deleteMeetingRoom", null);
__decorate([
    (0, common_1.Post)('UpdateMeetingRoom'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_meeting_room_dto_1.UpdateMeetingRoomDto]),
    __metadata("design:returntype", void 0)
], MeetingRoomController.prototype, "updateMeetingRoom", null);
__decorate([
    (0, common_1.Get)('GetMeetingRoom'),
    __param(0, (0, common_1.Query)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], MeetingRoomController.prototype, "getMeetingRoom", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MeetingRoomController.prototype, "remove", null);
exports.MeetingRoomController = MeetingRoomController = __decorate([
    (0, common_1.Controller)('meeting-room'),
    __metadata("design:paramtypes", [meeting_room_service_1.MeetingRoomService])
], MeetingRoomController);
//# sourceMappingURL=meeting-room.controller.js.map
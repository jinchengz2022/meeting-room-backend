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
exports.MeetingRoom = void 0;
const typeorm_1 = require("typeorm");
let MeetingRoom = class MeetingRoom {
};
exports.MeetingRoom = MeetingRoom;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({
        comment: '会议室id'
    }),
    __metadata("design:type", Number)
], MeetingRoom.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        comment: '会议室名称',
        length: 50
    }),
    __metadata("design:type", String)
], MeetingRoom.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({
        comment: '会议室容量'
    }),
    __metadata("design:type", Number)
], MeetingRoom.prototype, "capacity", void 0);
__decorate([
    (0, typeorm_1.Column)({
        comment: '会议室位置'
    }),
    __metadata("design:type", String)
], MeetingRoom.prototype, "position", void 0);
__decorate([
    (0, typeorm_1.Column)({
        comment: '描述',
        default: '',
        length: 100
    }),
    __metadata("design:type", String)
], MeetingRoom.prototype, "desc", void 0);
__decorate([
    (0, typeorm_1.Column)({
        comment: '是否被预定',
        default: false
    }),
    __metadata("design:type", Boolean)
], MeetingRoom.prototype, "isBooked", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        comment: '创建时间'
    }),
    __metadata("design:type", Date)
], MeetingRoom.prototype, "createTime", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        comment: '更新时间'
    }),
    __metadata("design:type", Date)
], MeetingRoom.prototype, "updateTime", void 0);
exports.MeetingRoom = MeetingRoom = __decorate([
    (0, typeorm_1.Entity)()
], MeetingRoom);
//# sourceMappingURL=meeting-room.entity.js.map
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
exports.BookingController = void 0;
const common_1 = require("@nestjs/common");
const booking_service_1 = require("./booking.service");
const create_booking_dto_1 = require("./dto/create-booking.dto");
const generateParseIntPipe_1 = require("../utils/generateParseIntPipe");
const custom_decrator_1 = require("../custom.decrator");
let BookingController = class BookingController {
    constructor(bookingService) {
        this.bookingService = bookingService;
    }
    init() {
        return this.bookingService.init();
    }
    list(pageNumber, pageSize, userName, roomName, position) {
        return this.bookingService.list({
            pageNumber,
            pageSize,
            position,
            userName,
            roomName,
        });
    }
    add(createBookingDto) {
        return this.bookingService.add(createBookingDto);
    }
    apply(id) {
        return this.bookingService.apply(id);
    }
    reject(id) {
        return this.bookingService.reject(id);
    }
    unbind(id) {
        return this.bookingService.unbind(id);
    }
};
exports.BookingController = BookingController;
__decorate([
    (0, common_1.Get)('init'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BookingController.prototype, "init", null);
__decorate([
    (0, common_1.Get)('list'),
    __param(0, (0, common_1.Query)('pageNumber', new common_1.DefaultValuePipe(1), (0, generateParseIntPipe_1.generateParseIntPipe)('缺少 pageNumber'))),
    __param(1, (0, common_1.Query)('pageSize', new common_1.DefaultValuePipe(3), (0, generateParseIntPipe_1.generateParseIntPipe)('缺少 pageSize'))),
    __param(2, (0, common_1.Query)('userName')),
    __param(3, (0, common_1.Query)('roomName')),
    __param(4, (0, common_1.Query)('position')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String]),
    __metadata("design:returntype", void 0)
], BookingController.prototype, "list", null);
__decorate([
    (0, common_1.Post)('add'),
    (0, custom_decrator_1.RequireLogin)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_booking_dto_1.CreateBookingDto]),
    __metadata("design:returntype", void 0)
], BookingController.prototype, "add", null);
__decorate([
    (0, common_1.Get)('apply/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], BookingController.prototype, "apply", null);
__decorate([
    (0, common_1.Get)('reject/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], BookingController.prototype, "reject", null);
__decorate([
    (0, common_1.Get)('unbind/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], BookingController.prototype, "unbind", null);
exports.BookingController = BookingController = __decorate([
    (0, common_1.Controller)('booking'),
    __metadata("design:paramtypes", [booking_service_1.BookingService])
], BookingController);
//# sourceMappingURL=booking.controller.js.map
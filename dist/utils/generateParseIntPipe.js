"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateParseIntPipe = generateParseIntPipe;
const common_1 = require("@nestjs/common");
function generateParseIntPipe(message) {
    return new common_1.ParseIntPipe({
        exceptionFactory() {
            throw new common_1.BadRequestException(message);
        },
    });
}
//# sourceMappingURL=generateParseIntPipe.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.md5 = void 0;
const crypto = require("crypto");
const md5 = (value) => {
    const hash = crypto.createHash('md5');
    hash.update(value);
    return hash.digest('hex');
};
exports.md5 = md5;
//# sourceMappingURL=md5.js.map
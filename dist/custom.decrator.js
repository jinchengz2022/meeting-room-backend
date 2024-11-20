"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequirePermissions = exports.RequireLogin = void 0;
const common_1 = require("@nestjs/common");
const RequireLogin = () => (0, common_1.SetMetadata)('require-login', true);
exports.RequireLogin = RequireLogin;
const RequirePermissions = (...permissions) => (0, common_1.SetMetadata)('require-permissions', permissions);
exports.RequirePermissions = RequirePermissions;
//# sourceMappingURL=custom.decrator.js.map
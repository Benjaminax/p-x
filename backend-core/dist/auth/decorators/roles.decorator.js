"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequiresRole = exports.Roles = void 0;
const common_1 = require("@nestjs/common");
const Roles = (...roles) => (0, common_1.SetMetadata)('roles', roles);
exports.Roles = Roles;
const RequiresRole = (...roles) => (0, exports.Roles)(...roles);
exports.RequiresRole = RequiresRole;
//# sourceMappingURL=roles.decorator.js.map
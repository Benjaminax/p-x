"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const bcrypt = __importStar(require("bcrypt"));
const users_service_1 = require("../users/users.service");
const user_schema_1 = require("../users/schemas/user.schema");
let AuthService = class AuthService {
    usersService;
    jwtService;
    configService;
    constructor(usersService, jwtService, configService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async validateUser(email, pass) {
        const user = await this.usersService.findOne(email);
        if (user && await bcrypt.compare(pass, user.passwordHash)) {
            const { passwordHash, ...result } = user.toObject();
            return result;
        }
        return null;
    }
    async login(user) {
        const tokenPair = await this.issueTokenPair(user);
        return {
            access_token: tokenPair.accessToken,
            refresh_token: tokenPair.refreshToken,
            user: {
                id: tokenPair.user.id,
                email: tokenPair.user.email,
                role: tokenPair.user.role,
                fullName: tokenPair.user.fullName,
            }
        };
    }
    async register(registerDto) {
        const existing = await this.usersService.findOne(registerDto.email);
        if (existing) {
            throw new common_1.UnauthorizedException('User already exists');
        }
        const user = await this.usersService.create(registerDto);
        return this.login(user);
    }
    async refresh(refreshToken) {
        const refreshSecret = this.configService.get('JWT_REFRESH_SECRET');
        if (!refreshSecret) {
            throw new common_1.UnauthorizedException('Refresh token is not configured');
        }
        let payload;
        try {
            payload = this.jwtService.verify(refreshToken, { secret: refreshSecret });
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        const userId = String(payload.sub);
        const user = await this.usersService.findById(userId);
        if (!user?.refreshTokenHash) {
            throw new common_1.UnauthorizedException('Refresh token is invalidated');
        }
        const matches = await bcrypt.compare(refreshToken, user.refreshTokenHash);
        if (!matches) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        if (user.refreshTokenExpiresAt && user.refreshTokenExpiresAt.getTime() < Date.now()) {
            await this.usersService.clearRefreshToken(userId);
            throw new common_1.UnauthorizedException('Refresh token expired');
        }
        const tokenPair = await this.issueTokenPair(user);
        return {
            access_token: tokenPair.accessToken,
            refresh_token: tokenPair.refreshToken,
            user: tokenPair.user,
        };
    }
    async logout(userId) {
        await this.usersService.clearRefreshToken(userId);
        return { success: true };
    }
    async issueTokenPair(user) {
        const safeUser = this.normalizeUser(user);
        const accessPayload = {
            username: safeUser.email,
            sub: safeUser.id,
            role: safeUser.role,
        };
        const refreshSecret = this.configService.get('JWT_REFRESH_SECRET') || this.configService.get('JWT_SECRET');
        const refreshExpiry = this.configService.get('JWT_REFRESH_EXPIRATION') || '7d';
        const accessToken = this.jwtService.sign(accessPayload, {
            expiresIn: (this.configService.get('JWT_EXPIRATION') || '15m'),
        });
        const refreshToken = this.jwtService.sign({ ...accessPayload, token_type: 'refresh' }, {
            secret: refreshSecret,
            expiresIn: refreshExpiry,
        });
        const refreshPayload = this.jwtService.verify(refreshToken, { secret: refreshSecret });
        const refreshTokenHash = await bcrypt.hash(refreshToken, await bcrypt.genSalt());
        await this.usersService.setRefreshToken(safeUser.id, refreshTokenHash, new Date(refreshPayload.exp * 1000));
        return {
            accessToken,
            refreshToken,
            user: safeUser,
        };
    }
    normalizeUser(user) {
        if (user instanceof user_schema_1.User) {
            return {
                id: user._id.toString(),
                email: user.email,
                role: user.role,
                fullName: user.fullName,
            };
        }
        return user;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map
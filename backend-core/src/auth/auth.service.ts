import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { User } from '../users/schemas/user.schema';

interface AuthUserPayload {
    id: string;
    email: string;
    role: string;
    fullName: string;
}

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findOne(email);
        if (user && await bcrypt.compare(pass, user.passwordHash)) {
            // Convert Mongoose document to plain object to remove methods and properties
            const { passwordHash, ...result } = user.toObject();
            return result;
        }
        return null;
    }

    async login(user: User | AuthUserPayload) {
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

    async register(registerDto: any) {
        // Check if user exists
        const existing = await this.usersService.findOne(registerDto.email);
        if (existing) {
            throw new UnauthorizedException('User already exists');
        }
        const user = await this.usersService.create(registerDto);
        return this.login(user);
    }

    async refresh(refreshToken: string) {
        const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET');
        if (!refreshSecret) {
            throw new UnauthorizedException('Refresh token is not configured');
        }

        let payload: any;
        try {
            payload = this.jwtService.verify(refreshToken, { secret: refreshSecret });
        } catch {
            throw new UnauthorizedException('Invalid refresh token');
        }

        const userId = String(payload.sub);
        const user = await this.usersService.findById(userId);
        if (!user?.refreshTokenHash) {
            throw new UnauthorizedException('Refresh token is invalidated');
        }

        const matches = await bcrypt.compare(refreshToken, user.refreshTokenHash);
        if (!matches) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        if (user.refreshTokenExpiresAt && user.refreshTokenExpiresAt.getTime() < Date.now()) {
            await this.usersService.clearRefreshToken(userId);
            throw new UnauthorizedException('Refresh token expired');
        }

        const tokenPair = await this.issueTokenPair(user);
        return {
            access_token: tokenPair.accessToken,
            refresh_token: tokenPair.refreshToken,
            user: tokenPair.user,
        };
    }

    async logout(userId: string) {
        await this.usersService.clearRefreshToken(userId);
        return { success: true };
    }

    private async issueTokenPair(user: User | AuthUserPayload) {
        const safeUser = this.normalizeUser(user);
        const accessPayload = {
            username: safeUser.email,
            sub: safeUser.id,
            role: safeUser.role,
        };

        const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET') || this.configService.get<string>('JWT_SECRET');
        const refreshExpiry = this.configService.get<string>('JWT_REFRESH_EXPIRATION') || '7d';

        const accessToken = this.jwtService.sign(accessPayload, {
            expiresIn: (this.configService.get<string>('JWT_EXPIRATION') || '15m') as any,
        });

        const refreshToken = this.jwtService.sign(
            { ...accessPayload, token_type: 'refresh' },
            {
                secret: refreshSecret,
                expiresIn: refreshExpiry as any,
            },
        );

        const refreshPayload = this.jwtService.verify(refreshToken, { secret: refreshSecret }) as { exp: number };
        const refreshTokenHash = await bcrypt.hash(refreshToken, await bcrypt.genSalt());
        await this.usersService.setRefreshToken(
            safeUser.id,
            refreshTokenHash,
            new Date(refreshPayload.exp * 1000),
        );

        return {
            accessToken,
            refreshToken,
            user: safeUser,
        };
    }

    private normalizeUser(user: User | AuthUserPayload): AuthUserPayload {
        if (user instanceof User) {
            return {
                id: user._id.toString(),
                email: user.email,
                role: user.role,
                fullName: user.fullName,
            };
        }

        return user;
    }
}

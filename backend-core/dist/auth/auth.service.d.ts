import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { User } from '../users/schemas/user.schema';
interface AuthUserPayload {
    id: string;
    email: string;
    role: string;
    fullName: string;
}
export declare class AuthService {
    private usersService;
    private jwtService;
    private configService;
    constructor(usersService: UsersService, jwtService: JwtService, configService: ConfigService);
    validateUser(email: string, pass: string): Promise<any>;
    login(user: User | AuthUserPayload): Promise<{
        access_token: string;
        refresh_token: string;
        user: {
            id: string;
            email: string;
            role: string;
            fullName: string;
        };
    }>;
    register(registerDto: any): Promise<{
        access_token: string;
        refresh_token: string;
        user: {
            id: string;
            email: string;
            role: string;
            fullName: string;
        };
    }>;
    refresh(refreshToken: string): Promise<{
        access_token: string;
        refresh_token: string;
        user: AuthUserPayload;
    }>;
    logout(userId: string): Promise<{
        success: boolean;
    }>;
    private issueTokenPair;
    private normalizeUser;
}
export {};

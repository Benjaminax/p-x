import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/schemas/user.schema';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(email: string, pass: string): Promise<any>;
    login(user: User): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            role: import("../users/schemas/user.schema").UserRole;
            fullName: string;
        };
    }>;
    register(registerDto: any): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            role: import("../users/schemas/user.schema").UserRole;
            fullName: string;
        };
    }>;
}

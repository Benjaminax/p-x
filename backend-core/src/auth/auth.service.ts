import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
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

    async login(user: User) {
        const payload = { username: user.email, sub: user._id.toString(), role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user._id.toString(),
                email: user.email,
                role: user.role,
                fullName: user.fullName
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
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default_secret_key_needs_change_32b';
const IV_LENGTH = 16;

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) { }

    private encrypt(text?: string): string | undefined {
        if (!text) return text;
        const iv = crypto.randomBytes(IV_LENGTH);
        const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return iv.toString('hex') + ':' + encrypted.toString('hex');
    }

    // NOTE: In a real app, decryption would happen only when explicitly requested to minimize exposure.
    // For simplicity here, we return the raw object and let the consumer decrypt if needed, 
    // or we can add a helper method to decrypt specific fields. 
    // The 'user' object returned by Mongoose is a Document.

    async create(createUserDto: CreateUserDto): Promise<User> {
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(createUserDto.password, salt);

        const newUser = new this.userModel({
            ...createUserDto,
            passwordHash,
            // Manual encryption for sensitive fields
            nhiNumber: this.encrypt(createUserDto.nhiNumber),
            phoneNumber: this.encrypt(createUserDto.phoneNumber),
        });
        return newUser.save();
    }

    async findOne(email: string): Promise<User | null> {
        return this.userModel.findOne({ email }).exec();
    }

    async findById(id: string): Promise<User | null> {
        return this.userModel.findById(id).exec();
    }

    async setRefreshToken(userId: string, refreshTokenHash: string, refreshTokenExpiresAt: Date): Promise<void> {
        await this.userModel.findByIdAndUpdate(userId, {
            refreshTokenHash,
            refreshTokenExpiresAt,
        }).exec();
    }

    async clearRefreshToken(userId: string): Promise<void> {
        await this.userModel.findByIdAndUpdate(userId, {
            $unset: {
                refreshTokenHash: 1,
                refreshTokenExpiresAt: 1,
            },
        }).exec();
    }
}

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum UserRole {
    ADMIN = 'admin',
    DOCTOR = 'doctor',
    NURSE = 'nurse',
    PATIENT = 'patient',
    SUPER_ADMIN = 'super_admin',
}

@Schema({ timestamps: true })
export class User extends Document {
    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    passwordHash: string;

    @Prop({ required: true })
    fullName: string;

    @Prop({ required: true, enum: UserRole, default: UserRole.PATIENT })
    role: UserRole;

    // Sensitive fields (Encrypted at Service level before saving)
    @Prop()
    nhiNumber?: string;

    @Prop()
    phoneNumber?: string;

    @Prop()
    refreshTokenHash?: string;

    @Prop()
    refreshTokenExpiresAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

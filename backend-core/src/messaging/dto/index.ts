import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsEnum, IsArray } from 'class-validator';
import { MessageType } from '../schemas/conversation.schema';

export class CreateConversationDto {
    @IsString()
    @IsNotEmpty()
    patientId!: string;

    @IsString()
    @IsOptional()
    doctorId?: string;

    @IsBoolean()
    @IsOptional()
    isAiConversation?: boolean;

    @IsString()
    @IsOptional()
    subject?: string;
}

export class SendMessageDto {
    @IsString()
    @IsNotEmpty()
    content!: string;

    @IsEnum(MessageType)
    @IsOptional()
    type?: MessageType;

    @IsArray()
    @IsOptional()
    attachments?: string[];

    @IsString()
    @IsOptional()
    medicalRecordId?: string;
}

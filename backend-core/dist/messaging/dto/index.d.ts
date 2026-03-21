import { MessageType } from '../schemas/conversation.schema';
export declare class CreateConversationDto {
    patientId: string;
    doctorId?: string;
    isAiConversation?: boolean;
    subject?: string;
}
export declare class SendMessageDto {
    content: string;
    type?: MessageType;
    attachments?: string[];
    medicalRecordId?: string;
}

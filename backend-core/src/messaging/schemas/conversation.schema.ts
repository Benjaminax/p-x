import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export enum MessageStatus {
    SENT = 'sent',
    DELIVERED = 'delivered',
    READ = 'read'
}

export enum MessageType {
    TEXT = 'text',
    IMAGE = 'image',
    DOCUMENT = 'document',
    VOICE = 'voice',
    VIDEO = 'video',
    MEDICAL_RECORD = 'medical_record'
}

@Schema({ _id: false })
export class Message {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
    senderId: MongooseSchema.Types.ObjectId;

    @Prop({ required: true })
    content: string;

    @Prop({ enum: MessageType, default: MessageType.TEXT })
    type: MessageType;

    @Prop({ type: [String] })
    attachments?: string[];

    @Prop({ required: true, default: Date.now })
    timestamp: Date;

    @Prop({ enum: MessageStatus, default: MessageStatus.SENT })
    status: MessageStatus;

    @Prop()
    readAt?: Date;

    // For medical record references
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'MedicalRecord' })
    medicalRecordId?: MongooseSchema.Types.ObjectId;

    // For AI-generated messages
    @Prop({ default: false })
    isAiGenerated?: boolean;
}

const MessageSchema = SchemaFactory.createForClass(Message);

@Schema({ timestamps: true })
export class Conversation extends Document {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
    patientId: MongooseSchema.Types.ObjectId;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
    doctorId?: MongooseSchema.Types.ObjectId;

    // For AI Doctor conversations
    @Prop({ default: false })
    isAiConversation: boolean;

    @Prop({ type: [MessageSchema], default: [] })
    messages: Message[];

    @Prop()
    subject?: string;

    @Prop()
    lastMessageAt?: Date;

    // Status
    @Prop({ default: true })
    isActive: boolean;

    @Prop({ default: false })
    isUrgent: boolean;

    // Tags for categorization
    @Prop({ type: [String] })
    tags?: string[];

    // Unread count per participant
    @Prop({ type: Map, of: Number, default: {} })
    unreadCount?: Map<string, number>;

    // Context for AI conversations
    @Prop({ type: [String] })
    contextRecordIds?: string[];

    // Sentiment analysis (for AI monitoring)
    @Prop()
    sentimentScore?: number; // -1 to 1

    // Priority (for triage)
    @Prop({ min: 1, max: 5 })
    priority?: number;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);

// Indexes
ConversationSchema.index({ patientId: 1, lastMessageAt: -1 });
ConversationSchema.index({ doctorId: 1, lastMessageAt: -1 });
ConversationSchema.index({ isAiConversation: 1 });
ConversationSchema.index({ isUrgent: 1, lastMessageAt: -1 });

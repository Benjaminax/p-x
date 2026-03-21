import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Conversation, Message, MessageType, MessageStatus } from './schemas/conversation.schema';

@Injectable()
export class MessagingService {
    constructor(
        @InjectModel(Conversation.name) private conversationModel: Model<Conversation>,
    ) {}

    // ============ Conversations ============

    async createConversation(
        patientId: string,
        doctorId?: string,
        isAiConversation: boolean = false,
        subject?: string
    ): Promise<Conversation> {
        const conversation = new this.conversationModel({
            patientId: new Types.ObjectId(patientId),
            doctorId: doctorId ? new Types.ObjectId(doctorId) : undefined,
            isAiConversation,
            subject,
            messages: [],
            unreadCount: new Map(),
        });

        return conversation.save();
    }

    async getConversations(userId: string, userRole: string): Promise<Conversation[]> {
        const query: any = { isActive: true };

        if (userRole === 'patient') {
            query.patientId = new Types.ObjectId(userId);
        } else if (userRole === 'doctor') {
            query.doctorId = new Types.ObjectId(userId);
        }

        return this.conversationModel
            .find(query)
            .populate('patientId', 'fullName email phoneNumber')
            .populate('doctorId', 'fullName email phoneNumber')
            .sort({ lastMessageAt: -1 })
            .exec();
    }

    async getConversationById(conversationId: string, userId: string, userRole: string): Promise<Conversation> {
        const conversation = await this.conversationModel
            .findById(conversationId)
            .populate('patientId', 'fullName email phoneNumber')
            .populate('doctorId', 'fullName email phoneNumber')
            .populate('messages.senderId', 'fullName email role')
            .exec();

        if (!conversation) {
            throw new NotFoundException('Conversation not found');
        }

        // Check permissions
        const isPatient = conversation.patientId.toString() === userId;
        const isDoctor = conversation.doctorId && conversation.doctorId.toString() === userId;

        if (userRole === 'patient' && !isPatient) {
            throw new ForbiddenException('Access denied');
        }

        if (userRole === 'doctor' && !isDoctor && !conversation.isAiConversation) {
            throw new ForbiddenException('Access denied');
        }

        return conversation;
    }

    async findOrCreateConversation(
        patientId: string,
        doctorId?: string,
        isAiConversation: boolean = false
    ): Promise<Conversation> {
        const query: any = {
            patientId: patientId,
            isAiConversation,
            isActive: true,
        };

        if (doctorId) {
            query.doctorId = doctorId;
        }

        let conversation = await this.conversationModel.findOne(query).exec();

        if (!conversation) {
            conversation = await this.createConversation(patientId, doctorId, isAiConversation) as any;
        }

        return conversation as any;
    }

    // ============ Messages ============

    async sendMessage(
        conversationId: string,
        senderId: string,
        content: string,
        type: MessageType = MessageType.TEXT,
        attachments?: string[],
        medicalRecordId?: string,
        isAiGenerated: boolean = false
    ): Promise<Conversation> {
        const message: any = {
            senderId: new Types.ObjectId(senderId),
            content,
            type,
            attachments,
            timestamp: new Date(),
            status: MessageStatus.SENT,
            medicalRecordId: medicalRecordId ? new Types.ObjectId(medicalRecordId) : undefined,
            isAiGenerated,
        };

        const conversation = await this.conversationModel.findByIdAndUpdate(
            conversationId,
            {
                $push: { messages: message },
                $set: { lastMessageAt: new Date() },
            },
            { new: true }
        ).exec();

        if (!conversation) {
            throw new NotFoundException('Conversation not found');
        }

        // Update unread count for recipient
        const recipientId = conversation.patientId.toString() === senderId 
            ? conversation.doctorId?.toString() 
            : conversation.patientId.toString();

        if (recipientId) {
            const currentCount = conversation.unreadCount?.get(recipientId) || 0;
            conversation.unreadCount?.set(recipientId, currentCount + 1);
            await conversation.save();
        }

        return conversation;
    }

    async markMessagesAsRead(conversationId: string, userId: string): Promise<Conversation> {
        const conversation = await this.conversationModel.findById(conversationId).exec();

        if (!conversation) {
            throw new NotFoundException('Conversation not found');
        }

        // Mark all messages from others as read
        conversation.messages.forEach(message => {
            if (message.senderId.toString() !== userId && message.status !== MessageStatus.READ) {
                message.status = MessageStatus.READ;
                message.readAt = new Date();
            }
        });

        // Reset unread count for this user
        conversation.unreadCount?.set(userId, 0);

        return conversation.save();
    }

    async getUnreadCount(userId: string): Promise<number> {
        const conversations = await this.conversationModel.find({
            $or: [
                { patientId: userId },
                { doctorId: userId },
            ],
            isActive: true,
        } as any).exec();

        let totalUnread = 0;
        conversations.forEach(conv => {
            const count = conv.unreadCount?.get(userId) || 0;
            totalUnread += count;
        });

        return totalUnread;
    }

    // ============ AI Conversation Features ============

    async createAiConversation(patientId: string, contextRecordIds?: string[]): Promise<Conversation> {
        const conversation = new this.conversationModel({
            patientId: new Types.ObjectId(patientId),
            isAiConversation: true,
            subject: 'AI Medical Assistant',
            messages: [],
            contextRecordIds,
            unreadCount: new Map(),
        });

        return conversation.save();
    }

    async sendAiMessage(
        conversationId: string,
        userMessage: string,
        aiResponse: string,
        patientId: string
    ): Promise<Conversation> {
        const userMsg: any = {
            senderId: new Types.ObjectId(patientId),
            content: userMessage,
            type: MessageType.TEXT,
            timestamp: new Date(),
            status: MessageStatus.SENT,
            isAiGenerated: false,
        };

        const aiMsg: any = {
            senderId: new Types.ObjectId('000000000000000000000000'), // System ID
            content: aiResponse,
            type: MessageType.TEXT,
            timestamp: new Date(),
            status: MessageStatus.SENT,
            isAiGenerated: true,
        };

        const conversation = await this.conversationModel.findByIdAndUpdate(
            conversationId,
            {
                $push: { messages: { $each: [userMsg, aiMsg] } },
                $set: { lastMessageAt: new Date() },
            },
            { new: true }
        ).exec();

        if (!conversation) {
            throw new NotFoundException('Conversation not found');
        }

        return conversation;
    }

    async updateConversationContext(conversationId: string, recordIds: string[]): Promise<Conversation> {
        const conversation = await this.conversationModel.findByIdAndUpdate(
            conversationId,
            { $addToSet: { contextRecordIds: { $each: recordIds } } },
            { new: true }
        ).exec();

        if (!conversation) {
            throw new NotFoundException('Conversation not found');
        }

        return conversation;
    }

    // ============ Urgent Messages ============

    async markAsUrgent(conversationId: string, priority: number = 5): Promise<Conversation> {
        const conversation = await this.conversationModel.findByIdAndUpdate(
            conversationId,
            { $set: { isUrgent: true, priority } },
            { new: true }
        ).exec();

        if (!conversation) {
            throw new NotFoundException('Conversation not found');
        }

        return conversation;
    }

    async getUrgentConversations(doctorId: string): Promise<Conversation[]> {
        return this.conversationModel
            .find({
                doctorId: doctorId,
                isUrgent: true,
                isActive: true,
            } as any)
            .populate('patientId', 'fullName email phoneNumber')
            .sort({ priority: -1, lastMessageAt: -1 })
            .exec();
    }

    // ============ Search & Filter ============

    async searchConversations(userId: string, userRole: string, searchTerm: string): Promise<Conversation[]> {
        const query: any = { isActive: true };

        if (userRole === 'patient') {
            query.patientId = new Types.ObjectId(userId);
        } else if (userRole === 'doctor') {
            query.doctorId = new Types.ObjectId(userId);
        }

        // Search in subject or message content
        query.$or = [
            { subject: { $regex: searchTerm, $options: 'i' } },
            { 'messages.content': { $regex: searchTerm, $options: 'i' } },
        ];

        return this.conversationModel
            .find(query)
            .populate('patientId', 'fullName email')
            .populate('doctorId', 'fullName email')
            .sort({ lastMessageAt: -1 })
            .exec();
    }

    async closeConversation(conversationId: string): Promise<Conversation> {
        const conversation = await this.conversationModel.findByIdAndUpdate(
            conversationId,
            { $set: { isActive: false } },
            { new: true }
        ).exec();

        if (!conversation) {
            throw new NotFoundException('Conversation not found');
        }

        return conversation;
    }
}

"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagingService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const conversation_schema_1 = require("./schemas/conversation.schema");
let MessagingService = class MessagingService {
    conversationModel;
    constructor(conversationModel) {
        this.conversationModel = conversationModel;
    }
    async createConversation(patientId, doctorId, isAiConversation = false, subject) {
        const conversation = new this.conversationModel({
            patientId: new mongoose_2.Types.ObjectId(patientId),
            doctorId: doctorId ? new mongoose_2.Types.ObjectId(doctorId) : undefined,
            isAiConversation,
            subject,
            messages: [],
            unreadCount: new Map(),
        });
        return conversation.save();
    }
    async getConversations(userId, userRole) {
        const query = { isActive: true };
        if (userRole === 'patient') {
            query.patientId = new mongoose_2.Types.ObjectId(userId);
        }
        else if (userRole === 'doctor') {
            query.doctorId = new mongoose_2.Types.ObjectId(userId);
        }
        return this.conversationModel
            .find(query)
            .populate('patientId', 'fullName email phoneNumber')
            .populate('doctorId', 'fullName email phoneNumber')
            .sort({ lastMessageAt: -1 })
            .exec();
    }
    async getConversationById(conversationId, userId, userRole) {
        const conversation = await this.conversationModel
            .findById(conversationId)
            .populate('patientId', 'fullName email phoneNumber')
            .populate('doctorId', 'fullName email phoneNumber')
            .populate('messages.senderId', 'fullName email role')
            .exec();
        if (!conversation) {
            throw new common_1.NotFoundException('Conversation not found');
        }
        const isPatient = conversation.patientId.toString() === userId;
        const isDoctor = conversation.doctorId && conversation.doctorId.toString() === userId;
        if (userRole === 'patient' && !isPatient) {
            throw new common_1.ForbiddenException('Access denied');
        }
        if (userRole === 'doctor' && !isDoctor && !conversation.isAiConversation) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return conversation;
    }
    async findOrCreateConversation(patientId, doctorId, isAiConversation = false) {
        const query = {
            patientId: patientId,
            isAiConversation,
            isActive: true,
        };
        if (doctorId) {
            query.doctorId = doctorId;
        }
        let conversation = await this.conversationModel.findOne(query).exec();
        if (!conversation) {
            conversation = await this.createConversation(patientId, doctorId, isAiConversation);
        }
        return conversation;
    }
    async sendMessage(conversationId, senderId, content, type = conversation_schema_1.MessageType.TEXT, attachments, medicalRecordId, isAiGenerated = false) {
        const message = {
            senderId: new mongoose_2.Types.ObjectId(senderId),
            content,
            type,
            attachments,
            timestamp: new Date(),
            status: conversation_schema_1.MessageStatus.SENT,
            medicalRecordId: medicalRecordId ? new mongoose_2.Types.ObjectId(medicalRecordId) : undefined,
            isAiGenerated,
        };
        const conversation = await this.conversationModel.findByIdAndUpdate(conversationId, {
            $push: { messages: message },
            $set: { lastMessageAt: new Date() },
        }, { new: true }).exec();
        if (!conversation) {
            throw new common_1.NotFoundException('Conversation not found');
        }
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
    async markMessagesAsRead(conversationId, userId) {
        const conversation = await this.conversationModel.findById(conversationId).exec();
        if (!conversation) {
            throw new common_1.NotFoundException('Conversation not found');
        }
        conversation.messages.forEach(message => {
            if (message.senderId.toString() !== userId && message.status !== conversation_schema_1.MessageStatus.READ) {
                message.status = conversation_schema_1.MessageStatus.READ;
                message.readAt = new Date();
            }
        });
        conversation.unreadCount?.set(userId, 0);
        return conversation.save();
    }
    async getUnreadCount(userId) {
        const conversations = await this.conversationModel.find({
            $or: [
                { patientId: userId },
                { doctorId: userId },
            ],
            isActive: true,
        }).exec();
        let totalUnread = 0;
        conversations.forEach(conv => {
            const count = conv.unreadCount?.get(userId) || 0;
            totalUnread += count;
        });
        return totalUnread;
    }
    async createAiConversation(patientId, contextRecordIds) {
        const conversation = new this.conversationModel({
            patientId: new mongoose_2.Types.ObjectId(patientId),
            isAiConversation: true,
            subject: 'AI Medical Assistant',
            messages: [],
            contextRecordIds,
            unreadCount: new Map(),
        });
        return conversation.save();
    }
    async sendAiMessage(conversationId, userMessage, aiResponse, patientId) {
        const userMsg = {
            senderId: new mongoose_2.Types.ObjectId(patientId),
            content: userMessage,
            type: conversation_schema_1.MessageType.TEXT,
            timestamp: new Date(),
            status: conversation_schema_1.MessageStatus.SENT,
            isAiGenerated: false,
        };
        const aiMsg = {
            senderId: new mongoose_2.Types.ObjectId('000000000000000000000000'),
            content: aiResponse,
            type: conversation_schema_1.MessageType.TEXT,
            timestamp: new Date(),
            status: conversation_schema_1.MessageStatus.SENT,
            isAiGenerated: true,
        };
        const conversation = await this.conversationModel.findByIdAndUpdate(conversationId, {
            $push: { messages: { $each: [userMsg, aiMsg] } },
            $set: { lastMessageAt: new Date() },
        }, { new: true }).exec();
        if (!conversation) {
            throw new common_1.NotFoundException('Conversation not found');
        }
        return conversation;
    }
    async updateConversationContext(conversationId, recordIds) {
        const conversation = await this.conversationModel.findByIdAndUpdate(conversationId, { $addToSet: { contextRecordIds: { $each: recordIds } } }, { new: true }).exec();
        if (!conversation) {
            throw new common_1.NotFoundException('Conversation not found');
        }
        return conversation;
    }
    async markAsUrgent(conversationId, priority = 5) {
        const conversation = await this.conversationModel.findByIdAndUpdate(conversationId, { $set: { isUrgent: true, priority } }, { new: true }).exec();
        if (!conversation) {
            throw new common_1.NotFoundException('Conversation not found');
        }
        return conversation;
    }
    async getUrgentConversations(doctorId) {
        return this.conversationModel
            .find({
            doctorId: doctorId,
            isUrgent: true,
            isActive: true,
        })
            .populate('patientId', 'fullName email phoneNumber')
            .sort({ priority: -1, lastMessageAt: -1 })
            .exec();
    }
    async searchConversations(userId, userRole, searchTerm) {
        const query = { isActive: true };
        if (userRole === 'patient') {
            query.patientId = new mongoose_2.Types.ObjectId(userId);
        }
        else if (userRole === 'doctor') {
            query.doctorId = new mongoose_2.Types.ObjectId(userId);
        }
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
    async closeConversation(conversationId) {
        const conversation = await this.conversationModel.findByIdAndUpdate(conversationId, { $set: { isActive: false } }, { new: true }).exec();
        if (!conversation) {
            throw new common_1.NotFoundException('Conversation not found');
        }
        return conversation;
    }
};
exports.MessagingService = MessagingService;
exports.MessagingService = MessagingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(conversation_schema_1.Conversation.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], MessagingService);
//# sourceMappingURL=messaging.service.js.map
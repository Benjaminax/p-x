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
exports.MessagingController = void 0;
const common_1 = require("@nestjs/common");
const messaging_service_1 = require("./messaging.service");
const guards_1 = require("../auth/guards");
const decorators_1 = require("../auth/decorators");
const user_schema_1 = require("../users/schemas/user.schema");
const dto_1 = require("./dto");
let MessagingController = class MessagingController {
    messagingService;
    constructor(messagingService) {
        this.messagingService = messagingService;
    }
    async createConversation(data, req) {
        return this.messagingService.createConversation(data.patientId, data.doctorId, data.isAiConversation, data.subject);
    }
    async getConversations(req) {
        return this.messagingService.getConversations(req.user.userId, req.user.role);
    }
    async getConversationById(conversationId, req) {
        return this.messagingService.getConversationById(conversationId, req.user.userId, req.user.role);
    }
    async findOrCreateConversation(data) {
        return this.messagingService.findOrCreateConversation(data.patientId, data.doctorId, data.isAiConversation || false);
    }
    async sendMessage(conversationId, data, req) {
        return this.messagingService.sendMessage(conversationId, req.user.userId, data.content, data.type, data.attachments, data.medicalRecordId, false);
    }
    async markMessagesAsRead(conversationId, req) {
        return this.messagingService.markMessagesAsRead(conversationId, req.user.userId);
    }
    async getUnreadCount(req) {
        const count = await this.messagingService.getUnreadCount(req.user.userId);
        return { unreadCount: count };
    }
    async createAiConversation(data, req) {
        const patientId = req.user.role === user_schema_1.UserRole.PATIENT ? req.user.userId : data.patientId;
        return this.messagingService.createAiConversation(patientId, data.contextRecordIds);
    }
    async sendAiMessage(conversationId, data, req) {
        const aiResponse = `I received your message: "${data.message}". This is a placeholder response. The actual AI integration will provide medical guidance based on your records.`;
        return this.messagingService.sendAiMessage(conversationId, data.message, aiResponse, req.user.userId);
    }
    async updateConversationContext(conversationId, data) {
        return this.messagingService.updateConversationContext(conversationId, data.recordIds);
    }
    async markAsUrgent(conversationId, data) {
        return this.messagingService.markAsUrgent(conversationId, data.priority);
    }
    async getUrgentConversations(req) {
        return this.messagingService.getUrgentConversations(req.user.userId);
    }
    async searchConversations(searchTerm, req) {
        return this.messagingService.searchConversations(req.user.userId, req.user.role, searchTerm);
    }
    async closeConversation(conversationId) {
        return this.messagingService.closeConversation(conversationId);
    }
};
exports.MessagingController = MessagingController;
__decorate([
    (0, common_1.Post)('conversations'),
    (0, decorators_1.Roles)(user_schema_1.UserRole.PATIENT, user_schema_1.UserRole.DOCTOR, user_schema_1.UserRole.ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateConversationDto, Object]),
    __metadata("design:returntype", Promise)
], MessagingController.prototype, "createConversation", null);
__decorate([
    (0, common_1.Get)('conversations'),
    (0, decorators_1.Roles)(user_schema_1.UserRole.PATIENT, user_schema_1.UserRole.DOCTOR, user_schema_1.UserRole.ADMIN),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MessagingController.prototype, "getConversations", null);
__decorate([
    (0, common_1.Get)('conversations/:conversationId'),
    (0, decorators_1.Roles)(user_schema_1.UserRole.PATIENT, user_schema_1.UserRole.DOCTOR, user_schema_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('conversationId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MessagingController.prototype, "getConversationById", null);
__decorate([
    (0, common_1.Post)('conversations/find-or-create'),
    (0, decorators_1.Roles)(user_schema_1.UserRole.PATIENT, user_schema_1.UserRole.DOCTOR, user_schema_1.UserRole.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MessagingController.prototype, "findOrCreateConversation", null);
__decorate([
    (0, common_1.Post)('conversations/:conversationId/messages'),
    (0, decorators_1.Roles)(user_schema_1.UserRole.PATIENT, user_schema_1.UserRole.DOCTOR, user_schema_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('conversationId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.SendMessageDto, Object]),
    __metadata("design:returntype", Promise)
], MessagingController.prototype, "sendMessage", null);
__decorate([
    (0, common_1.Put)('conversations/:conversationId/read'),
    (0, decorators_1.Roles)(user_schema_1.UserRole.PATIENT, user_schema_1.UserRole.DOCTOR, user_schema_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('conversationId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MessagingController.prototype, "markMessagesAsRead", null);
__decorate([
    (0, common_1.Get)('unread-count'),
    (0, decorators_1.Roles)(user_schema_1.UserRole.PATIENT, user_schema_1.UserRole.DOCTOR, user_schema_1.UserRole.ADMIN),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MessagingController.prototype, "getUnreadCount", null);
__decorate([
    (0, common_1.Post)('ai/conversations'),
    (0, decorators_1.Roles)(user_schema_1.UserRole.PATIENT, user_schema_1.UserRole.ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MessagingController.prototype, "createAiConversation", null);
__decorate([
    (0, common_1.Post)('ai/conversations/:conversationId/message'),
    (0, decorators_1.Roles)(user_schema_1.UserRole.PATIENT, user_schema_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('conversationId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], MessagingController.prototype, "sendAiMessage", null);
__decorate([
    (0, common_1.Put)('ai/conversations/:conversationId/context'),
    (0, decorators_1.Roles)(user_schema_1.UserRole.PATIENT, user_schema_1.UserRole.DOCTOR, user_schema_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('conversationId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MessagingController.prototype, "updateConversationContext", null);
__decorate([
    (0, common_1.Put)('conversations/:conversationId/urgent'),
    (0, decorators_1.Roles)(user_schema_1.UserRole.PATIENT, user_schema_1.UserRole.DOCTOR, user_schema_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('conversationId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MessagingController.prototype, "markAsUrgent", null);
__decorate([
    (0, common_1.Get)('urgent'),
    (0, decorators_1.Roles)(user_schema_1.UserRole.DOCTOR, user_schema_1.UserRole.ADMIN),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MessagingController.prototype, "getUrgentConversations", null);
__decorate([
    (0, common_1.Get)('search'),
    (0, decorators_1.Roles)(user_schema_1.UserRole.PATIENT, user_schema_1.UserRole.DOCTOR, user_schema_1.UserRole.ADMIN),
    __param(0, (0, common_1.Query)('q')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MessagingController.prototype, "searchConversations", null);
__decorate([
    (0, common_1.Put)('conversations/:conversationId/close'),
    (0, decorators_1.Roles)(user_schema_1.UserRole.PATIENT, user_schema_1.UserRole.DOCTOR, user_schema_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('conversationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MessagingController.prototype, "closeConversation", null);
exports.MessagingController = MessagingController = __decorate([
    (0, common_1.Controller)('messaging'),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    __metadata("design:paramtypes", [messaging_service_1.MessagingService])
], MessagingController);
//# sourceMappingURL=messaging.controller.js.map
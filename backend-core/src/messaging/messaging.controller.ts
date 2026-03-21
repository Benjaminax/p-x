import {
    Controller,
    Get,
    Post,
    Put,
    Body,
    Param,
    Query,
    UseGuards,
    Request,
} from '@nestjs/common';
import { MessagingService } from './messaging.service';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../auth/decorators';
import { UserRole } from '../users/schemas/user.schema';
import { SendMessageDto, CreateConversationDto } from './dto';

@Controller('messaging')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MessagingController {
    constructor(private readonly messagingService: MessagingService) {}

    // ============ Conversations ============

    @Post('conversations')
    @Roles(UserRole.PATIENT, UserRole.DOCTOR, UserRole.ADMIN)
    async createConversation(@Body() data: CreateConversationDto, @Request() req: any) {
        return this.messagingService.createConversation(
            data.patientId,
            data.doctorId,
            data.isAiConversation,
            data.subject
        );
    }

    @Get('conversations')
    @Roles(UserRole.PATIENT, UserRole.DOCTOR, UserRole.ADMIN)
    async getConversations(@Request() req: any) {
        return this.messagingService.getConversations(req.user.userId, req.user.role);
    }

    @Get('conversations/:conversationId')
    @Roles(UserRole.PATIENT, UserRole.DOCTOR, UserRole.ADMIN)
    async getConversationById(@Param('conversationId') conversationId: string, @Request() req: any) {
        return this.messagingService.getConversationById(
            conversationId,
            req.user.userId,
            req.user.role
        );
    }

    @Post('conversations/find-or-create')
    @Roles(UserRole.PATIENT, UserRole.DOCTOR, UserRole.ADMIN)
    async findOrCreateConversation(
        @Body() data: { patientId: string; doctorId?: string; isAiConversation?: boolean }
    ) {
        return this.messagingService.findOrCreateConversation(
            data.patientId,
            data.doctorId,
            data.isAiConversation || false
        );
    }

    // ============ Messages ============

    @Post('conversations/:conversationId/messages')
    @Roles(UserRole.PATIENT, UserRole.DOCTOR, UserRole.ADMIN)
    async sendMessage(
        @Param('conversationId') conversationId: string,
        @Body() data: SendMessageDto,
        @Request() req: any
    ) {
        return this.messagingService.sendMessage(
            conversationId,
            req.user.userId,
            data.content,
            data.type,
            data.attachments,
            data.medicalRecordId,
            false
        );
    }

    @Put('conversations/:conversationId/read')
    @Roles(UserRole.PATIENT, UserRole.DOCTOR, UserRole.ADMIN)
    async markMessagesAsRead(@Param('conversationId') conversationId: string, @Request() req: any) {
        return this.messagingService.markMessagesAsRead(conversationId, req.user.userId);
    }

    @Get('unread-count')
    @Roles(UserRole.PATIENT, UserRole.DOCTOR, UserRole.ADMIN)
    async getUnreadCount(@Request() req: any) {
        const count = await this.messagingService.getUnreadCount(req.user.userId);
        return { unreadCount: count };
    }

    // ============ AI Conversations ============

    @Post('ai/conversations')
    @Roles(UserRole.PATIENT, UserRole.ADMIN)
    async createAiConversation(
        @Body() data: { patientId: string; contextRecordIds?: string[] },
        @Request() req: any
    ) {
        // Ensure patients can only create conversations for themselves
        const patientId = req.user.role === UserRole.PATIENT ? req.user.userId : data.patientId;
        return this.messagingService.createAiConversation(patientId, data.contextRecordIds);
    }

    @Post('ai/conversations/:conversationId/message')
    @Roles(UserRole.PATIENT, UserRole.ADMIN)
    async sendAiMessage(
        @Param('conversationId') conversationId: string,
        @Body() data: { message: string },
        @Request() req: any
    ) {
        // This is a placeholder - the AI response should come from the AI service
        // For now, we'll just echo back
        const aiResponse = `I received your message: "${data.message}". This is a placeholder response. The actual AI integration will provide medical guidance based on your records.`;

        return this.messagingService.sendAiMessage(
            conversationId,
            data.message,
            aiResponse,
            req.user.userId
        );
    }

    @Put('ai/conversations/:conversationId/context')
    @Roles(UserRole.PATIENT, UserRole.DOCTOR, UserRole.ADMIN)
    async updateConversationContext(
        @Param('conversationId') conversationId: string,
        @Body() data: { recordIds: string[] }
    ) {
        return this.messagingService.updateConversationContext(conversationId, data.recordIds);
    }

    // ============ Urgent Messages ============

    @Put('conversations/:conversationId/urgent')
    @Roles(UserRole.PATIENT, UserRole.DOCTOR, UserRole.ADMIN)
    async markAsUrgent(
        @Param('conversationId') conversationId: string,
        @Body() data: { priority?: number }
    ) {
        return this.messagingService.markAsUrgent(conversationId, data.priority);
    }

    @Get('urgent')
    @Roles(UserRole.DOCTOR, UserRole.ADMIN)
    async getUrgentConversations(@Request() req: any) {
        return this.messagingService.getUrgentConversations(req.user.userId);
    }

    // ============ Search ============

    @Get('search')
    @Roles(UserRole.PATIENT, UserRole.DOCTOR, UserRole.ADMIN)
    async searchConversations(@Query('q') searchTerm: string, @Request() req: any) {
        return this.messagingService.searchConversations(
            req.user.userId,
            req.user.role,
            searchTerm
        );
    }

    @Put('conversations/:conversationId/close')
    @Roles(UserRole.PATIENT, UserRole.DOCTOR, UserRole.ADMIN)
    async closeConversation(@Param('conversationId') conversationId: string) {
        return this.messagingService.closeConversation(conversationId);
    }
}

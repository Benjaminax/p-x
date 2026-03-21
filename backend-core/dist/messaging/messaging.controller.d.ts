import { MessagingService } from './messaging.service';
import { SendMessageDto, CreateConversationDto } from './dto';
export declare class MessagingController {
    private readonly messagingService;
    constructor(messagingService: MessagingService);
    createConversation(data: CreateConversationDto, req: any): Promise<import("./schemas/conversation.schema").Conversation>;
    getConversations(req: any): Promise<import("./schemas/conversation.schema").Conversation[]>;
    getConversationById(conversationId: string, req: any): Promise<import("./schemas/conversation.schema").Conversation>;
    findOrCreateConversation(data: {
        patientId: string;
        doctorId?: string;
        isAiConversation?: boolean;
    }): Promise<import("./schemas/conversation.schema").Conversation>;
    sendMessage(conversationId: string, data: SendMessageDto, req: any): Promise<import("./schemas/conversation.schema").Conversation>;
    markMessagesAsRead(conversationId: string, req: any): Promise<import("./schemas/conversation.schema").Conversation>;
    getUnreadCount(req: any): Promise<{
        unreadCount: number;
    }>;
    createAiConversation(data: {
        patientId: string;
        contextRecordIds?: string[];
    }, req: any): Promise<import("./schemas/conversation.schema").Conversation>;
    sendAiMessage(conversationId: string, data: {
        message: string;
    }, req: any): Promise<import("./schemas/conversation.schema").Conversation>;
    updateConversationContext(conversationId: string, data: {
        recordIds: string[];
    }): Promise<import("./schemas/conversation.schema").Conversation>;
    markAsUrgent(conversationId: string, data: {
        priority?: number;
    }): Promise<import("./schemas/conversation.schema").Conversation>;
    getUrgentConversations(req: any): Promise<import("./schemas/conversation.schema").Conversation[]>;
    searchConversations(searchTerm: string, req: any): Promise<import("./schemas/conversation.schema").Conversation[]>;
    closeConversation(conversationId: string): Promise<import("./schemas/conversation.schema").Conversation>;
}

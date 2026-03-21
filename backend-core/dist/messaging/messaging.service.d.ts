import { Model } from 'mongoose';
import { Conversation, MessageType } from './schemas/conversation.schema';
export declare class MessagingService {
    private conversationModel;
    constructor(conversationModel: Model<Conversation>);
    createConversation(patientId: string, doctorId?: string, isAiConversation?: boolean, subject?: string): Promise<Conversation>;
    getConversations(userId: string, userRole: string): Promise<Conversation[]>;
    getConversationById(conversationId: string, userId: string, userRole: string): Promise<Conversation>;
    findOrCreateConversation(patientId: string, doctorId?: string, isAiConversation?: boolean): Promise<Conversation>;
    sendMessage(conversationId: string, senderId: string, content: string, type?: MessageType, attachments?: string[], medicalRecordId?: string, isAiGenerated?: boolean): Promise<Conversation>;
    markMessagesAsRead(conversationId: string, userId: string): Promise<Conversation>;
    getUnreadCount(userId: string): Promise<number>;
    createAiConversation(patientId: string, contextRecordIds?: string[]): Promise<Conversation>;
    sendAiMessage(conversationId: string, userMessage: string, aiResponse: string, patientId: string): Promise<Conversation>;
    updateConversationContext(conversationId: string, recordIds: string[]): Promise<Conversation>;
    markAsUrgent(conversationId: string, priority?: number): Promise<Conversation>;
    getUrgentConversations(doctorId: string): Promise<Conversation[]>;
    searchConversations(userId: string, userRole: string, searchTerm: string): Promise<Conversation[]>;
    closeConversation(conversationId: string): Promise<Conversation>;
}

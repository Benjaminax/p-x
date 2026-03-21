import { Document, Schema as MongooseSchema } from 'mongoose';
export declare enum MessageStatus {
    SENT = "sent",
    DELIVERED = "delivered",
    READ = "read"
}
export declare enum MessageType {
    TEXT = "text",
    IMAGE = "image",
    DOCUMENT = "document",
    VOICE = "voice",
    VIDEO = "video",
    MEDICAL_RECORD = "medical_record"
}
export declare class Message {
    senderId: MongooseSchema.Types.ObjectId;
    content: string;
    type: MessageType;
    attachments?: string[];
    timestamp: Date;
    status: MessageStatus;
    readAt?: Date;
    medicalRecordId?: MongooseSchema.Types.ObjectId;
    isAiGenerated?: boolean;
}
export declare class Conversation extends Document {
    patientId: MongooseSchema.Types.ObjectId;
    doctorId?: MongooseSchema.Types.ObjectId;
    isAiConversation: boolean;
    messages: Message[];
    subject?: string;
    lastMessageAt?: Date;
    isActive: boolean;
    isUrgent: boolean;
    tags?: string[];
    unreadCount?: Map<string, number>;
    contextRecordIds?: string[];
    sentimentScore?: number;
    priority?: number;
}
export declare const ConversationSchema: MongooseSchema<Conversation, import("mongoose").Model<Conversation, any, any, any, (Document<unknown, any, Conversation, any, import("mongoose").DefaultSchemaOptions> & Conversation & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, Conversation, any, import("mongoose").DefaultSchemaOptions> & Conversation & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}), any, Conversation>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Conversation, Document<unknown, {}, Conversation, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Conversation & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    _id?: import("mongoose").SchemaDefinitionProperty<import("mongoose").Types.ObjectId, Conversation, Document<unknown, {}, Conversation, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Conversation & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    patientId?: import("mongoose").SchemaDefinitionProperty<MongooseSchema.Types.ObjectId, Conversation, Document<unknown, {}, Conversation, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Conversation & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    doctorId?: import("mongoose").SchemaDefinitionProperty<MongooseSchema.Types.ObjectId | undefined, Conversation, Document<unknown, {}, Conversation, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Conversation & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    tags?: import("mongoose").SchemaDefinitionProperty<string[] | undefined, Conversation, Document<unknown, {}, Conversation, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Conversation & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    isAiConversation?: import("mongoose").SchemaDefinitionProperty<boolean, Conversation, Document<unknown, {}, Conversation, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Conversation & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    messages?: import("mongoose").SchemaDefinitionProperty<Message[], Conversation, Document<unknown, {}, Conversation, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Conversation & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    subject?: import("mongoose").SchemaDefinitionProperty<string | undefined, Conversation, Document<unknown, {}, Conversation, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Conversation & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    lastMessageAt?: import("mongoose").SchemaDefinitionProperty<Date | undefined, Conversation, Document<unknown, {}, Conversation, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Conversation & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    isActive?: import("mongoose").SchemaDefinitionProperty<boolean, Conversation, Document<unknown, {}, Conversation, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Conversation & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    isUrgent?: import("mongoose").SchemaDefinitionProperty<boolean, Conversation, Document<unknown, {}, Conversation, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Conversation & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    unreadCount?: import("mongoose").SchemaDefinitionProperty<Map<string, number> | undefined, Conversation, Document<unknown, {}, Conversation, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Conversation & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    contextRecordIds?: import("mongoose").SchemaDefinitionProperty<string[] | undefined, Conversation, Document<unknown, {}, Conversation, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Conversation & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    sentimentScore?: import("mongoose").SchemaDefinitionProperty<number | undefined, Conversation, Document<unknown, {}, Conversation, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Conversation & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    priority?: import("mongoose").SchemaDefinitionProperty<number | undefined, Conversation, Document<unknown, {}, Conversation, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Conversation & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Conversation>;

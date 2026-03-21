import { Document, Schema as MongooseSchema } from 'mongoose';
export declare enum RecordType {
    LAB_RESULT = "lab_result",
    IMAGING = "imaging",
    PRESCRIPTION = "prescription",
    VISIT_SUMMARY = "visit_summary",
    VACCINATION = "vaccination",
    SURGERY = "surgery",
    OTHER = "other"
}
export declare enum RecordStatus {
    PENDING = "pending",
    VERIFIED = "verified",
    ARCHIVED = "archived"
}
export declare class MedicalRecord extends Document {
    patientId: MongooseSchema.Types.ObjectId;
    doctorId?: MongooseSchema.Types.ObjectId;
    title: string;
    description?: string;
    type: RecordType;
    status: RecordStatus;
    recordDate: Date;
    structuredData?: {
        findings?: string[];
        diagnoses?: string[];
        recommendations?: string[];
        measurements?: Record<string, any>;
        labValues?: Record<string, any>;
    };
    attachmentUrls?: string[];
    attachmentTypes?: string[];
    ocrText?: string;
    aiSummary?: string;
    tags?: string[];
    sharedWith?: MongooseSchema.Types.ObjectId[];
    language?: string;
    translatedContent?: Record<string, string>;
    encryptionKeyId?: string;
    isEncrypted: boolean;
    facilityName?: string;
    facilityId?: string;
}
export declare const MedicalRecordSchema: MongooseSchema<MedicalRecord, import("mongoose").Model<MedicalRecord, any, any, any, (Document<unknown, any, MedicalRecord, any, import("mongoose").DefaultSchemaOptions> & MedicalRecord & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, MedicalRecord, any, import("mongoose").DefaultSchemaOptions> & MedicalRecord & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}), any, MedicalRecord>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, MedicalRecord, Document<unknown, {}, MedicalRecord, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<MedicalRecord & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    _id?: import("mongoose").SchemaDefinitionProperty<import("mongoose").Types.ObjectId, MedicalRecord, Document<unknown, {}, MedicalRecord, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<MedicalRecord & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    type?: import("mongoose").SchemaDefinitionProperty<RecordType, MedicalRecord, Document<unknown, {}, MedicalRecord, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<MedicalRecord & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    description?: import("mongoose").SchemaDefinitionProperty<string | undefined, MedicalRecord, Document<unknown, {}, MedicalRecord, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<MedicalRecord & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    patientId?: import("mongoose").SchemaDefinitionProperty<MongooseSchema.Types.ObjectId, MedicalRecord, Document<unknown, {}, MedicalRecord, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<MedicalRecord & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    doctorId?: import("mongoose").SchemaDefinitionProperty<MongooseSchema.Types.ObjectId | undefined, MedicalRecord, Document<unknown, {}, MedicalRecord, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<MedicalRecord & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    title?: import("mongoose").SchemaDefinitionProperty<string, MedicalRecord, Document<unknown, {}, MedicalRecord, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<MedicalRecord & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<RecordStatus, MedicalRecord, Document<unknown, {}, MedicalRecord, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<MedicalRecord & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    recordDate?: import("mongoose").SchemaDefinitionProperty<Date, MedicalRecord, Document<unknown, {}, MedicalRecord, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<MedicalRecord & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    structuredData?: import("mongoose").SchemaDefinitionProperty<{
        findings?: string[];
        diagnoses?: string[];
        recommendations?: string[];
        measurements?: Record<string, any>;
        labValues?: Record<string, any>;
    } | undefined, MedicalRecord, Document<unknown, {}, MedicalRecord, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<MedicalRecord & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    attachmentUrls?: import("mongoose").SchemaDefinitionProperty<string[] | undefined, MedicalRecord, Document<unknown, {}, MedicalRecord, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<MedicalRecord & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    attachmentTypes?: import("mongoose").SchemaDefinitionProperty<string[] | undefined, MedicalRecord, Document<unknown, {}, MedicalRecord, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<MedicalRecord & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    ocrText?: import("mongoose").SchemaDefinitionProperty<string | undefined, MedicalRecord, Document<unknown, {}, MedicalRecord, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<MedicalRecord & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    aiSummary?: import("mongoose").SchemaDefinitionProperty<string | undefined, MedicalRecord, Document<unknown, {}, MedicalRecord, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<MedicalRecord & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    tags?: import("mongoose").SchemaDefinitionProperty<string[] | undefined, MedicalRecord, Document<unknown, {}, MedicalRecord, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<MedicalRecord & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    sharedWith?: import("mongoose").SchemaDefinitionProperty<MongooseSchema.Types.ObjectId[] | undefined, MedicalRecord, Document<unknown, {}, MedicalRecord, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<MedicalRecord & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    language?: import("mongoose").SchemaDefinitionProperty<string | undefined, MedicalRecord, Document<unknown, {}, MedicalRecord, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<MedicalRecord & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    translatedContent?: import("mongoose").SchemaDefinitionProperty<Record<string, string> | undefined, MedicalRecord, Document<unknown, {}, MedicalRecord, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<MedicalRecord & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    encryptionKeyId?: import("mongoose").SchemaDefinitionProperty<string | undefined, MedicalRecord, Document<unknown, {}, MedicalRecord, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<MedicalRecord & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    isEncrypted?: import("mongoose").SchemaDefinitionProperty<boolean, MedicalRecord, Document<unknown, {}, MedicalRecord, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<MedicalRecord & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    facilityName?: import("mongoose").SchemaDefinitionProperty<string | undefined, MedicalRecord, Document<unknown, {}, MedicalRecord, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<MedicalRecord & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    facilityId?: import("mongoose").SchemaDefinitionProperty<string | undefined, MedicalRecord, Document<unknown, {}, MedicalRecord, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<MedicalRecord & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, MedicalRecord>;

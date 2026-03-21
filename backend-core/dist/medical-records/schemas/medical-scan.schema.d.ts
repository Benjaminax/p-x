import { Document, Schema as MongooseSchema } from 'mongoose';
export declare enum ScanType {
    XRAY = "xray",
    CT_SCAN = "ct_scan",
    MRI = "mri",
    ULTRASOUND = "ultrasound",
    PET_SCAN = "pet_scan",
    MAMMOGRAM = "mammogram",
    BONE_SCAN = "bone_scan",
    DEXA_SCAN = "dexa_scan",
    OTHER = "other"
}
export declare enum ScanStatus {
    PENDING_REVIEW = "pending_review",
    REVIEWED = "reviewed",
    REQUIRES_FOLLOWUP = "requires_followup",
    NORMAL = "normal",
    ABNORMAL = "abnormal"
}
export declare class Finding {
    description: string;
    location?: string;
    severity?: string;
    measurements?: string;
    isCritical?: boolean;
}
export declare class AIAnalysis {
    model?: string;
    confidence?: number;
    detectedAnomalies?: string[];
    summary?: string;
    recommendations?: string;
    analysisDate?: Date;
}
export declare class MedicalScan extends Document {
    patientId: MongooseSchema.Types.ObjectId;
    orderingDoctorId?: MongooseSchema.Types.ObjectId;
    radiologistId?: MongooseSchema.Types.ObjectId;
    scanDate: Date;
    scanType: ScanType;
    bodyPart: string;
    status: ScanStatus;
    imageUrls: string[];
    imageFormats?: string[];
    thumbnailUrl?: string;
    reportPdfUrl?: string;
    radiologistReport?: string;
    findings?: Finding[];
    impression?: string;
    clinicalHistory?: string;
    indication?: string;
    aiAnalysis?: AIAnalysis;
    facilityName?: string;
    facilityAddress?: string;
    radiologistName?: string;
    technique?: string;
    contrastUsed?: boolean;
    contrastType?: string;
    followUpRequired?: boolean;
    followUpDate?: Date;
    followUpInstructions?: string;
    comparedWithScanId?: MongooseSchema.Types.ObjectId;
    comparisonNotes?: string;
    dicomMetadata?: Record<string, any>;
    isEncrypted: boolean;
    encryptionKeyId?: string;
    patientNotified?: boolean;
    patientNotifiedAt?: Date;
}
export declare const MedicalScanSchema: MongooseSchema<MedicalScan, import("mongoose").Model<MedicalScan, any, any, any, (Document<unknown, any, MedicalScan, any, import("mongoose").DefaultSchemaOptions> & MedicalScan & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, MedicalScan, any, import("mongoose").DefaultSchemaOptions> & MedicalScan & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}), any, MedicalScan>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, MedicalScan, Document<unknown, {}, MedicalScan, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<MedicalScan & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    _id?: import("mongoose").SchemaDefinitionProperty<import("mongoose").Types.ObjectId, MedicalScan, Document<unknown, {}, MedicalScan, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<MedicalScan & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    patientId?: import("mongoose").SchemaDefinitionProperty<MongooseSchema.Types.ObjectId, MedicalScan, Document<unknown, {}, MedicalScan, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<MedicalScan & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<ScanStatus, MedicalScan, Document<unknown, {}, MedicalScan, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<MedicalScan & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    encryptionKeyId?: import("mongoose").SchemaDefinitionProperty<string | undefined, MedicalScan, Document<unknown, {}, MedicalScan, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<MedicalScan & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    isEncrypted?: import("mongoose").SchemaDefinitionProperty<boolean, MedicalScan, Document<unknown, {}, MedicalScan, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<MedicalScan & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    facilityName?: import("mongoose").SchemaDefinitionProperty<string | undefined, MedicalScan, Document<unknown, {}, MedicalScan, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<MedicalScan & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    findings?: import("mongoose").SchemaDefinitionProperty<Finding[] | undefined, MedicalScan, Document<unknown, {}, MedicalScan, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<MedicalScan & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    orderingDoctorId?: import("mongoose").SchemaDefinitionProperty<MongooseSchema.Types.ObjectId | undefined, MedicalScan, Document<unknown, {}, MedicalScan, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<MedicalScan & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    radiologistId?: import("mongoose").SchemaDefinitionProperty<MongooseSchema.Types.ObjectId | undefined, MedicalScan, Document<unknown, {}, MedicalScan, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<MedicalScan & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    scanDate?: import("mongoose").SchemaDefinitionProperty<Date, MedicalScan, Document<unknown, {}, MedicalScan, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<MedicalScan & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    scanType?: import("mongoose").SchemaDefinitionProperty<ScanType, MedicalScan, Document<unknown, {}, MedicalScan, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<MedicalScan & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    bodyPart?: import("mongoose").SchemaDefinitionProperty<string, MedicalScan, Document<unknown, {}, MedicalScan, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<MedicalScan & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    imageUrls?: import("mongoose").SchemaDefinitionProperty<string[], MedicalScan, Document<unknown, {}, MedicalScan, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<MedicalScan & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    imageFormats?: import("mongoose").SchemaDefinitionProperty<string[] | undefined, MedicalScan, Document<unknown, {}, MedicalScan, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<MedicalScan & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    thumbnailUrl?: import("mongoose").SchemaDefinitionProperty<string | undefined, MedicalScan, Document<unknown, {}, MedicalScan, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<MedicalScan & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    reportPdfUrl?: import("mongoose").SchemaDefinitionProperty<string | undefined, MedicalScan, Document<unknown, {}, MedicalScan, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<MedicalScan & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    radiologistReport?: import("mongoose").SchemaDefinitionProperty<string | undefined, MedicalScan, Document<unknown, {}, MedicalScan, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<MedicalScan & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    impression?: import("mongoose").SchemaDefinitionProperty<string | undefined, MedicalScan, Document<unknown, {}, MedicalScan, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<MedicalScan & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    clinicalHistory?: import("mongoose").SchemaDefinitionProperty<string | undefined, MedicalScan, Document<unknown, {}, MedicalScan, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<MedicalScan & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    indication?: import("mongoose").SchemaDefinitionProperty<string | undefined, MedicalScan, Document<unknown, {}, MedicalScan, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<MedicalScan & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    aiAnalysis?: import("mongoose").SchemaDefinitionProperty<AIAnalysis | undefined, MedicalScan, Document<unknown, {}, MedicalScan, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<MedicalScan & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    facilityAddress?: import("mongoose").SchemaDefinitionProperty<string | undefined, MedicalScan, Document<unknown, {}, MedicalScan, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<MedicalScan & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    radiologistName?: import("mongoose").SchemaDefinitionProperty<string | undefined, MedicalScan, Document<unknown, {}, MedicalScan, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<MedicalScan & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    technique?: import("mongoose").SchemaDefinitionProperty<string | undefined, MedicalScan, Document<unknown, {}, MedicalScan, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<MedicalScan & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    contrastUsed?: import("mongoose").SchemaDefinitionProperty<boolean | undefined, MedicalScan, Document<unknown, {}, MedicalScan, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<MedicalScan & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    contrastType?: import("mongoose").SchemaDefinitionProperty<string | undefined, MedicalScan, Document<unknown, {}, MedicalScan, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<MedicalScan & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    followUpRequired?: import("mongoose").SchemaDefinitionProperty<boolean | undefined, MedicalScan, Document<unknown, {}, MedicalScan, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<MedicalScan & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    followUpDate?: import("mongoose").SchemaDefinitionProperty<Date | undefined, MedicalScan, Document<unknown, {}, MedicalScan, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<MedicalScan & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    followUpInstructions?: import("mongoose").SchemaDefinitionProperty<string | undefined, MedicalScan, Document<unknown, {}, MedicalScan, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<MedicalScan & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    comparedWithScanId?: import("mongoose").SchemaDefinitionProperty<MongooseSchema.Types.ObjectId | undefined, MedicalScan, Document<unknown, {}, MedicalScan, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<MedicalScan & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    comparisonNotes?: import("mongoose").SchemaDefinitionProperty<string | undefined, MedicalScan, Document<unknown, {}, MedicalScan, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<MedicalScan & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    dicomMetadata?: import("mongoose").SchemaDefinitionProperty<Record<string, any> | undefined, MedicalScan, Document<unknown, {}, MedicalScan, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<MedicalScan & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    patientNotified?: import("mongoose").SchemaDefinitionProperty<boolean | undefined, MedicalScan, Document<unknown, {}, MedicalScan, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<MedicalScan & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    patientNotifiedAt?: import("mongoose").SchemaDefinitionProperty<Date | undefined, MedicalScan, Document<unknown, {}, MedicalScan, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<MedicalScan & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, MedicalScan>;

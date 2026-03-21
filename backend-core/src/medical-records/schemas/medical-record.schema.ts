import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export enum RecordType {
    LAB_RESULT = 'lab_result',
    IMAGING = 'imaging',
    PRESCRIPTION = 'prescription',
    VISIT_SUMMARY = 'visit_summary',
    VACCINATION = 'vaccination',
    SURGERY = 'surgery',
    OTHER = 'other'
}

export enum RecordStatus {
    PENDING = 'pending',
    VERIFIED = 'verified',
    ARCHIVED = 'archived'
}

@Schema({ timestamps: true })
export class MedicalRecord extends Document {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
    patientId: MongooseSchema.Types.ObjectId;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
    doctorId?: MongooseSchema.Types.ObjectId;

    @Prop({ required: true })
    title: string;

    @Prop()
    description?: string;

    @Prop({ required: true, enum: RecordType })
    type: RecordType;

    @Prop({ enum: RecordStatus, default: RecordStatus.PENDING })
    status: RecordStatus;

    @Prop({ required: true })
    recordDate: Date;

    // Structured medical data (JSON format)
    @Prop({ type: Object })
    structuredData?: {
        findings?: string[];
        diagnoses?: string[];
        recommendations?: string[];
        measurements?: Record<string, any>;
        labValues?: Record<string, any>;
    };

    // File attachments (encrypted)
    @Prop({ type: [String] })
    attachmentUrls?: string[];

    @Prop({ type: [String] })
    attachmentTypes?: string[]; // ['pdf', 'jpg', 'dicom', etc.]

    // OCR extracted text
    @Prop()
    ocrText?: string;

    // AI-generated summary
    @Prop()
    aiSummary?: string;

    // Tags for better categorization
    @Prop({ type: [String] })
    tags?: string[];

    // Sharing permissions
    @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }] })
    sharedWith?: MongooseSchema.Types.ObjectId[];

    // For multi-language support
    @Prop()
    language?: string;

    @Prop({ type: Object })
    translatedContent?: Record<string, string>;

    // Encryption metadata
    @Prop()
    encryptionKeyId?: string;

    @Prop({ default: false })
    isEncrypted: boolean;

    // Facility/Hospital information
    @Prop()
    facilityName?: string;

    @Prop()
    facilityId?: string;
}

export const MedicalRecordSchema = SchemaFactory.createForClass(MedicalRecord);

// Indexes for better query performance
MedicalRecordSchema.index({ patientId: 1, recordDate: -1 });
MedicalRecordSchema.index({ patientId: 1, type: 1 });
MedicalRecordSchema.index({ doctorId: 1 });
MedicalRecordSchema.index({ status: 1 });

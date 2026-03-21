import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export enum ScanType {
    XRAY = 'xray',
    CT_SCAN = 'ct_scan',
    MRI = 'mri',
    ULTRASOUND = 'ultrasound',
    PET_SCAN = 'pet_scan',
    MAMMOGRAM = 'mammogram',
    BONE_SCAN = 'bone_scan',
    DEXA_SCAN = 'dexa_scan',
    OTHER = 'other'
}

export enum ScanStatus {
    PENDING_REVIEW = 'pending_review',
    REVIEWED = 'reviewed',
    REQUIRES_FOLLOWUP = 'requires_followup',
    NORMAL = 'normal',
    ABNORMAL = 'abnormal'
}

@Schema({ _id: false })
export class Finding {
    @Prop({ required: true })
    description: string;

    @Prop()
    location?: string;

    @Prop()
    severity?: string; // 'mild', 'moderate', 'severe'

    @Prop()
    measurements?: string;

    @Prop({ default: false })
    isCritical?: boolean;
}

const FindingSchema = SchemaFactory.createForClass(Finding);

@Schema({ _id: false })
export class AIAnalysis {
    @Prop()
    model?: string;

    @Prop()
    confidence?: number;

    @Prop({ type: [String] })
    detectedAnomalies?: string[];

    @Prop()
    summary?: string;

    @Prop()
    recommendations?: string;

    @Prop()
    analysisDate?: Date;
}

const AIAnalysisSchema = SchemaFactory.createForClass(AIAnalysis);

@Schema({ timestamps: true })
export class MedicalScan extends Document {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
    patientId: MongooseSchema.Types.ObjectId;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
    orderingDoctorId?: MongooseSchema.Types.ObjectId;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
    radiologistId?: MongooseSchema.Types.ObjectId;

    @Prop({ required: true })
    scanDate: Date;

    @Prop({ enum: ScanType, required: true })
    scanType: ScanType;

    @Prop({ required: true })
    bodyPart: string;

    @Prop({ enum: ScanStatus, default: ScanStatus.PENDING_REVIEW })
    status: ScanStatus;

    // Image files (DICOM, PNG, JPG, etc.)
    @Prop({ type: [String], required: true })
    imageUrls: string[];

    @Prop({ type: [String] })
    imageFormats?: string[]; // ['dicom', 'jpg', 'png']

    @Prop()
    thumbnailUrl?: string;

    // Report
    @Prop()
    reportPdfUrl?: string;

    @Prop()
    radiologistReport?: string;

    @Prop({ type: [FindingSchema] })
    findings?: Finding[];

    @Prop()
    impression?: string;

    @Prop()
    clinicalHistory?: string;

    @Prop()
    indication?: string;

    // AI Analysis
    @Prop({ type: AIAnalysisSchema })
    aiAnalysis?: AIAnalysis;

    // Facility information
    @Prop()
    facilityName?: string;

    @Prop()
    facilityAddress?: string;

    @Prop()
    radiologistName?: string;

    // Technical details
    @Prop()
    technique?: string;

    @Prop()
    contrastUsed?: boolean;

    @Prop()
    contrastType?: string;

    // Follow-up
    @Prop()
    followUpRequired?: boolean;

    @Prop()
    followUpDate?: Date;

    @Prop()
    followUpInstructions?: string;

    // Comparison with previous scans
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'MedicalScan' })
    comparedWithScanId?: MongooseSchema.Types.ObjectId;

    @Prop()
    comparisonNotes?: string;

    // DICOM metadata
    @Prop({ type: Object })
    dicomMetadata?: Record<string, any>;

    // Encryption
    @Prop({ default: false })
    isEncrypted: boolean;

    @Prop()
    encryptionKeyId?: string;

    // Patient notification
    @Prop({ default: false })
    patientNotified?: boolean;

    @Prop()
    patientNotifiedAt?: Date;
}

export const MedicalScanSchema = SchemaFactory.createForClass(MedicalScan);

// Indexes
MedicalScanSchema.index({ patientId: 1, scanDate: -1 });
MedicalScanSchema.index({ orderingDoctorId: 1, scanDate: -1 });
MedicalScanSchema.index({ radiologistId: 1, status: 1 });
MedicalScanSchema.index({ status: 1, scanDate: -1 });

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export enum PrescriptionStatus {
    ACTIVE = 'active',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
    EXPIRED = 'expired'
}

export enum Frequency {
    ONCE_DAILY = 'once_daily',
    TWICE_DAILY = 'twice_daily',
    THREE_TIMES_DAILY = 'three_times_daily',
    FOUR_TIMES_DAILY = 'four_times_daily',
    AS_NEEDED = 'as_needed',
    WEEKLY = 'weekly',
    CUSTOM = 'custom'
}

@Schema({ _id: false })
export class Medication {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    dosage: string;

    @Prop({ required: true, enum: Frequency })
    frequency: Frequency;

    @Prop()
    customFrequency?: string;

    @Prop({ required: true })
    startDate: Date;

    @Prop()
    endDate?: Date;

    @Prop()
    instructions?: string;

    @Prop({ type: [String] })
    sideEffects?: string[];

    @Prop({ default: 0 })
    adherencePercentage?: number;
}

const MedicationSchema = SchemaFactory.createForClass(Medication);

@Schema({ timestamps: true })
export class Prescription extends Document {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
    patientId: MongooseSchema.Types.ObjectId;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
    doctorId: MongooseSchema.Types.ObjectId;

    @Prop({ type: [MedicationSchema], required: true })
    medications: Medication[];

    @Prop({ required: true })
    prescriptionDate: Date;

    @Prop({ enum: PrescriptionStatus, default: PrescriptionStatus.ACTIVE })
    status: PrescriptionStatus;

    @Prop()
    notes?: string;

    @Prop()
    diagnosis?: string;

    @Prop({ type: [String] })
    attachments?: string[];

    // Refill information
    @Prop({ default: 0 })
    refillsRemaining?: number;

    @Prop()
    pharmacyName?: string;

    @Prop()
    pharmacyPhone?: string;

    // Digital signature (for verification)
    @Prop()
    digitalSignature?: string;

    @Prop({ default: false })
    isVerified: boolean;
}

export const PrescriptionSchema = SchemaFactory.createForClass(Prescription);

// Indexes
PrescriptionSchema.index({ patientId: 1, prescriptionDate: -1 });
PrescriptionSchema.index({ doctorId: 1 });
PrescriptionSchema.index({ status: 1 });

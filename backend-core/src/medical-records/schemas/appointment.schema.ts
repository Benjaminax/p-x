import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export enum AppointmentStatus {
    SCHEDULED = 'scheduled',
    CONFIRMED = 'confirmed',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
    NO_SHOW = 'no_show',
    RESCHEDULED = 'rescheduled'
}

export enum AppointmentType {
    IN_PERSON = 'in_person',
    TELEMEDICINE = 'telemedicine',
    PHONE = 'phone',
    EMERGENCY = 'emergency',
    FOLLOW_UP = 'follow_up',
    ROUTINE_CHECKUP = 'routine_checkup'
}

export enum Department {
    CARDIOLOGY = 'cardiology',
    NEUROLOGY = 'neurology',
    ORTHOPEDICS = 'orthopedics',
    PEDIATRICS = 'pediatrics',
    GENERAL_PRACTICE = 'general_practice',
    DERMATOLOGY = 'dermatology',
    PSYCHIATRY = 'psychiatry',
    RADIOLOGY = 'radiology',
    EMERGENCY = 'emergency'
}

@Schema({ timestamps: true })
export class Appointment extends Document {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
    patientId: MongooseSchema.Types.ObjectId;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
    doctorId: MongooseSchema.Types.ObjectId;

    @Prop({ required: true })
    scheduledDate: Date;

    @Prop({ required: true })
    scheduledTime: string;

    @Prop()
    duration?: number; // in minutes

    @Prop({ enum: AppointmentStatus, default: AppointmentStatus.SCHEDULED })
    status: AppointmentStatus;

    @Prop({ enum: AppointmentType, required: true })
    type: AppointmentType;

    @Prop({ enum: Department })
    department?: Department;

    @Prop({ required: true })
    reason: string;

    @Prop()
    symptoms?: string;

    @Prop({ type: [String] })
    attachedDocuments?: string[];

    // Location details
    @Prop()
    hospitalName?: string;

    @Prop()
    roomNumber?: string;

    @Prop()
    address?: string;

    // Telemedicine details
    @Prop()
    meetingLink?: string;

    @Prop()
    meetingId?: string;

    // Notes
    @Prop()
    patientNotes?: string;

    @Prop()
    doctorNotes?: string;

    // Follow-up information
    @Prop()
    isFollowUp?: boolean;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Appointment' })
    previousAppointmentId?: MongooseSchema.Types.ObjectId;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Appointment' })
    nextAppointmentId?: MongooseSchema.Types.ObjectId;

    // Reminders
    @Prop({ default: false })
    reminderSent?: boolean;

    @Prop({ type: [Date] })
    reminderDates?: Date[];

    // Billing
    @Prop()
    estimatedCost?: number;

    @Prop()
    currency?: string;

    @Prop({ default: false })
    isPaid?: boolean;

    // Cancellation details
    @Prop()
    cancellationReason?: string;

    @Prop()
    cancelledBy?: string; // 'patient' or 'doctor'

    @Prop()
    cancelledAt?: Date;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);

// Indexes
AppointmentSchema.index({ patientId: 1, scheduledDate: -1 });
AppointmentSchema.index({ doctorId: 1, scheduledDate: -1 });
AppointmentSchema.index({ status: 1 });
AppointmentSchema.index({ scheduledDate: 1, status: 1 });

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ _id: false })
export class BloodPressure {
    @Prop({ required: true })
    systolic: number;

    @Prop({ required: true })
    diastolic: number;

    @Prop()
    unit: string; // 'mmHg'
}

const BloodPressureSchema = SchemaFactory.createForClass(BloodPressure);

@Schema({ timestamps: true })
export class VitalSigns extends Document {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
    patientId: MongooseSchema.Types.ObjectId;

    @Prop({ required: true })
    recordedAt: Date;

    // Blood Pressure
    @Prop({ type: BloodPressureSchema })
    bloodPressure?: BloodPressure;

    // Heart Rate (bpm)
    @Prop()
    heartRate?: number;

    // Temperature (Celsius or Fahrenheit)
    @Prop()
    temperature?: number;

    @Prop({ default: 'C' })
    temperatureUnit?: string;

    // Respiratory Rate (breaths per minute)
    @Prop()
    respiratoryRate?: number;

    // Oxygen Saturation (%)
    @Prop()
    oxygenSaturation?: number;

    // Weight (kg or lbs)
    @Prop()
    weight?: number;

    @Prop({ default: 'kg' })
    weightUnit?: string;

    // Height (cm or inches)
    @Prop()
    height?: number;

    @Prop({ default: 'cm' })
    heightUnit?: string;

    // BMI (calculated)
    @Prop()
    bmi?: number;

    // Blood Glucose (mg/dL or mmol/L)
    @Prop()
    bloodGlucose?: number;

    @Prop({ default: 'mg/dL' })
    glucoseUnit?: string;

    // Pain Level (0-10 scale)
    @Prop({ min: 0, max: 10 })
    painLevel?: number;

    // Additional notes
    @Prop()
    notes?: string;

    // Who recorded it
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
    recordedBy?: MongooseSchema.Types.ObjectId;

    // Location
    @Prop()
    location?: string; // 'home', 'hospital', 'clinic'

    // Symptoms at the time
    @Prop({ type: [String] })
    symptoms?: string[];

    // AI-generated insights
    @Prop()
    aiInsights?: string;

    // Alerts/Flags
    @Prop({ type: [String] })
    alerts?: string[]; // ['high_bp', 'low_glucose', etc.]
}

export const VitalSignsSchema = SchemaFactory.createForClass(VitalSigns);

// Indexes
VitalSignsSchema.index({ patientId: 1, recordedAt: -1 });
VitalSignsSchema.index({ patientId: 1, alerts: 1 });

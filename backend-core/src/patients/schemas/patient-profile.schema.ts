import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export enum BloodType {
  A_POS = 'A+',
  A_NEG = 'A-',
  B_POS = 'B+',
  B_NEG = 'B-',
  AB_POS = 'AB+',
  AB_NEG = 'AB-',
  O_POS = 'O+',
  O_NEG = 'O-',
}

export enum Genotype {
  AA = 'AA',
  AS = 'AS',
  SS = 'SS',
  AC = 'AC',
  SC = 'SC',
}

@Schema({ timestamps: true })
export class PatientProfile extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true, unique: true })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop()
  dateOfBirth?: Date;

  @Prop({ enum: Gender })
  gender?: Gender;

  @Prop({ enum: BloodType })
  bloodType?: BloodType;

  @Prop({ enum: Genotype })
  genotype?: Genotype;

  @Prop()
  heightCm?: number;

  @Prop()
  weightKg?: number;

  @Prop()
  profilePhotoUrl?: string;

  @Prop()
  emergencyContactName?: string;

  @Prop()
  emergencyContactPhone?: string;

  @Prop()
  healthInsuranceProvider?: string;

  @Prop()
  healthInsuranceNumber?: string;

  @Prop()
  insuranceCardUrl?: string;

  @Prop()
  qrCodeUrl?: string;

  @Prop({ default: true })
  isOfflineSyncEnabled: boolean;

  @Prop()
  deletedAt?: Date;
}

export const PatientProfileSchema = SchemaFactory.createForClass(PatientProfile);

PatientProfileSchema.index({ userId: 1 }, { unique: true });
PatientProfileSchema.index({ deletedAt: 1 });

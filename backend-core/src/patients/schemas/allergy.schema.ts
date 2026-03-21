import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export enum AllergySeverity {
  MILD = 'mild',
  MODERATE = 'moderate',
  SEVERE = 'severe',
  LIFE_THREATENING = 'life-threatening',
}

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class Allergy extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'PatientProfile', required: true })
  patientId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  allergen: string;

  @Prop()
  reaction?: string;

  @Prop({ enum: AllergySeverity, required: true })
  severity: AllergySeverity;

  @Prop({ default: false })
  verifiedByLab: boolean;

  @Prop()
  deletedAt?: Date;
}

export const AllergySchema = SchemaFactory.createForClass(Allergy);

AllergySchema.index({ patientId: 1, createdAt: -1 });
AllergySchema.index({ deletedAt: 1 });

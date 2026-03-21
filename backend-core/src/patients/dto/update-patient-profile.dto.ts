import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { BloodType, Gender, Genotype } from '../schemas/patient-profile.schema';

export class UpdatePatientProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(80)
  firstName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  lastName?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsEnum(BloodType)
  bloodType?: BloodType;

  @IsOptional()
  @IsEnum(Genotype)
  genotype?: Genotype;

  @IsOptional()
  @IsNumber()
  @Min(1)
  heightCm?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  weightKg?: number;

  @IsOptional()
  @IsString()
  profilePhotoUrl?: string;

  @IsOptional()
  @IsString()
  emergencyContactName?: string;

  @IsOptional()
  @IsString()
  emergencyContactPhone?: string;

  @IsOptional()
  @IsString()
  healthInsuranceProvider?: string;

  @IsOptional()
  @IsString()
  healthInsuranceNumber?: string;

  @IsOptional()
  @IsString()
  insuranceCardUrl?: string;

  @IsOptional()
  @IsBoolean()
  isOfflineSyncEnabled?: boolean;
}

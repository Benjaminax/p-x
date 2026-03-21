import { IsBoolean, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { AllergySeverity } from '../schemas/allergy.schema';

export class CreateAllergyDto {
  @IsString()
  @MaxLength(120)
  allergen: string;

  @IsOptional()
  @IsString()
  reaction?: string;

  @IsEnum(AllergySeverity)
  severity: AllergySeverity;

  @IsOptional()
  @IsBoolean()
  verifiedByLab?: boolean;
}

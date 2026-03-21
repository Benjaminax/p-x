import { AllergySeverity } from '../schemas/allergy.schema';
export declare class CreateAllergyDto {
    allergen: string;
    reaction?: string;
    severity: AllergySeverity;
    verifiedByLab?: boolean;
}

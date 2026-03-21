import { BloodType, Gender, Genotype } from '../schemas/patient-profile.schema';
export declare class UpdatePatientProfileDto {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    gender?: Gender;
    bloodType?: BloodType;
    genotype?: Genotype;
    heightCm?: number;
    weightKg?: number;
    profilePhotoUrl?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    healthInsuranceProvider?: string;
    healthInsuranceNumber?: string;
    insuranceCardUrl?: string;
    isOfflineSyncEnabled?: boolean;
}

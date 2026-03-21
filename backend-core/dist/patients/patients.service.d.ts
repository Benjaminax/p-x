import { Model, Types } from 'mongoose';
import { UserRole } from '../users/schemas/user.schema';
import { CreateAllergyDto } from './dto/create-allergy.dto';
import { UpdatePatientProfileDto } from './dto/update-patient-profile.dto';
import { Allergy } from './schemas/allergy.schema';
import { PatientProfile } from './schemas/patient-profile.schema';
export declare class PatientsService {
    private readonly patientProfileModel;
    private readonly allergyModel;
    constructor(patientProfileModel: Model<PatientProfile>, allergyModel: Model<Allergy>);
    getOwnProfile(userId: string): Promise<PatientProfile>;
    updateOwnProfile(userId: string, payload: UpdatePatientProfileDto): Promise<PatientProfile>;
    getOfflinePack(userId: string): Promise<{
        profile: PatientProfile;
        allergies: (import("mongoose").Document<unknown, {}, Allergy, {}, import("mongoose").DefaultSchemaOptions> & Allergy & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
        bloodType: import("./schemas/patient-profile.schema").BloodType | null;
        genotype: import("./schemas/patient-profile.schema").Genotype | null;
        currentMedications: never[];
        activePrescriptions: never[];
        emergencyContact: {
            name: string | null;
            phone: string | null;
        };
        medicalRecords: never[];
        insuranceCard: {
            provider: string | null;
            number: string | null;
            cardUrl: string | null;
        };
        lastSynced: string;
    }>;
    getOwnAllergies(userId: string): Promise<Allergy[]>;
    addAllergy(userId: string, payload: CreateAllergyDto): Promise<Allergy>;
    removeAllergy(userId: string, allergyId: string): Promise<{
        success: true;
    }>;
    assertPatientRole(role: UserRole): void;
    private findPatientByUserId;
}

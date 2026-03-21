import { Request } from 'express';
import { CreateAllergyDto } from './dto/create-allergy.dto';
import { UpdatePatientProfileDto } from './dto/update-patient-profile.dto';
import { PatientsService } from './patients.service';
export declare class PatientsController {
    private readonly patientsService;
    constructor(patientsService: PatientsService);
    getProfile(req: Request & {
        user: any;
    }): Promise<import("./schemas/patient-profile.schema").PatientProfile>;
    updateProfile(req: Request & {
        user: any;
    }, payload: UpdatePatientProfileDto): Promise<import("./schemas/patient-profile.schema").PatientProfile>;
    getOfflinePack(req: Request & {
        user: any;
    }): Promise<{
        profile: import("./schemas/patient-profile.schema").PatientProfile;
        allergies: (import("mongoose").Document<unknown, {}, import("./schemas/allergy.schema").Allergy, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/allergy.schema").Allergy & Required<{
            _id: import("mongoose").Types.ObjectId;
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
    getAllergies(req: Request & {
        user: any;
    }): Promise<import("./schemas/allergy.schema").Allergy[]>;
    addAllergy(req: Request & {
        user: any;
    }, payload: CreateAllergyDto): Promise<import("./schemas/allergy.schema").Allergy>;
    removeAllergy(req: Request & {
        user: any;
    }, id: string): Promise<{
        success: true;
    }>;
}

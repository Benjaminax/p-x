import { RecordType, RecordStatus } from '../schemas/medical-record.schema';
export declare class CreateMedicalRecordDto {
    patientId: string;
    title: string;
    description?: string;
    type: RecordType;
    status?: RecordStatus;
    recordDate: Date;
    structuredData?: any;
    attachmentUrls?: string[];
    tags?: string[];
    facilityName?: string;
}
export declare class CreatePrescriptionDto {
    patientId: string;
    medications: any[];
    prescriptionDate: Date;
    notes?: string;
    diagnosis?: string;
}
export declare class CreateVitalSignsDto {
    patientId: string;
    recordedAt: Date;
    bloodPressure?: {
        systolic: number;
        diastolic: number;
    };
    heartRate?: number;
    temperature?: number;
    oxygenSaturation?: number;
    weight?: number;
    height?: number;
    notes?: string;
}
export declare class CreateAppointmentDto {
    patientId: string;
    doctorId: string;
    scheduledDate: Date;
    scheduledTime: string;
    type: string;
    reason: string;
    symptoms?: string;
}
export declare class CreateMedicalScanDto {
    patientId: string;
    scanDate: Date;
    scanType: string;
    bodyPart: string;
    imageUrls: string[];
    clinicalHistory?: string;
}

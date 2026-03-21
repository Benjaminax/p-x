import { Model } from 'mongoose';
import { MedicalRecord, RecordType, RecordStatus } from './schemas/medical-record.schema';
import { Prescription, PrescriptionStatus } from './schemas/prescription.schema';
import { VitalSigns } from './schemas/vital-signs.schema';
import { Appointment, AppointmentStatus } from './schemas/appointment.schema';
import { MedicalScan, ScanStatus } from './schemas/medical-scan.schema';
export declare class MedicalRecordsService {
    private medicalRecordModel;
    private prescriptionModel;
    private vitalSignsModel;
    private appointmentModel;
    private medicalScanModel;
    constructor(medicalRecordModel: Model<MedicalRecord>, prescriptionModel: Model<Prescription>, vitalSignsModel: Model<VitalSigns>, appointmentModel: Model<Appointment>, medicalScanModel: Model<MedicalScan>);
    createMedicalRecord(data: Partial<MedicalRecord>): Promise<MedicalRecord>;
    getMedicalRecords(patientId: string, filters?: {
        type?: RecordType;
        status?: RecordStatus;
        startDate?: Date;
        endDate?: Date;
    }): Promise<MedicalRecord[]>;
    getMedicalRecordById(recordId: string, userId: string, userRole: string): Promise<MedicalRecord>;
    updateMedicalRecord(recordId: string, data: Partial<MedicalRecord>): Promise<MedicalRecord>;
    shareMedicalRecord(recordId: string, userIds: string[]): Promise<MedicalRecord>;
    createPrescription(data: Partial<Prescription>): Promise<Prescription>;
    getPrescriptions(patientId: string, filters?: {
        status?: PrescriptionStatus;
        active?: boolean;
    }): Promise<Prescription[]>;
    updatePrescriptionStatus(prescriptionId: string, status: PrescriptionStatus): Promise<Prescription>;
    updateMedicationAdherence(prescriptionId: string, medicationName: string, adherence: number): Promise<Prescription>;
    recordVitalSigns(data: Partial<VitalSigns>): Promise<VitalSigns>;
    getVitalSigns(patientId: string, filters?: {
        startDate?: Date;
        endDate?: Date;
        limit?: number;
    }): Promise<VitalSigns[]>;
    getLatestVitals(patientId: string): Promise<VitalSigns | null>;
    createAppointment(data: Partial<Appointment>): Promise<Appointment>;
    getAppointments(userId: string, userRole: string, filters?: {
        status?: AppointmentStatus;
        startDate?: Date;
        endDate?: Date;
    }): Promise<Appointment[]>;
    updateAppointmentStatus(appointmentId: string, status: AppointmentStatus, notes?: string): Promise<Appointment>;
    rescheduleAppointment(appointmentId: string, newDate: Date, newTime: string): Promise<Appointment>;
    createMedicalScan(data: Partial<MedicalScan>): Promise<MedicalScan>;
    getMedicalScans(patientId: string, filters?: {
        scanType?: string;
        status?: ScanStatus;
    }): Promise<MedicalScan[]>;
    updateScanReport(scanId: string, report: {
        radiologistReport?: string;
        findings?: any[];
        impression?: string;
        status?: ScanStatus;
    }): Promise<MedicalScan>;
    addAiAnalysisToScan(scanId: string, analysis: any): Promise<MedicalScan>;
    getPatientHealthSummary(patientId: string): Promise<{
        patientId: string;
        latestVitals: VitalSigns | null;
        upcomingAppointments: Appointment[];
        activePrescriptions: Prescription[];
        recentScans: MedicalScan[];
        totalRecords: number;
        lastUpdated: Date;
    }>;
}

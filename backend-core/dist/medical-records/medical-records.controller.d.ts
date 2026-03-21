import { MedicalRecordsService } from './medical-records.service';
import { CreateMedicalRecordDto, CreatePrescriptionDto, CreateVitalSignsDto, CreateAppointmentDto, CreateMedicalScanDto } from './dto';
export declare class MedicalRecordsController {
    private readonly medicalRecordsService;
    constructor(medicalRecordsService: MedicalRecordsService);
    createMedicalRecord(data: CreateMedicalRecordDto, req: any): Promise<import("./schemas/medical-record.schema").MedicalRecord>;
    getMedicalRecords(patientId: string, req: any, type?: string, status?: string, startDate?: string, endDate?: string): Promise<import("./schemas/medical-record.schema").MedicalRecord[]>;
    getMedicalRecordById(recordId: string, req: any): Promise<import("./schemas/medical-record.schema").MedicalRecord>;
    updateMedicalRecord(recordId: string, data: any): Promise<import("./schemas/medical-record.schema").MedicalRecord>;
    shareMedicalRecord(recordId: string, userIds: string[]): Promise<import("./schemas/medical-record.schema").MedicalRecord>;
    createPrescription(data: CreatePrescriptionDto, req: any): Promise<import("./schemas/prescription.schema").Prescription>;
    getPrescriptions(patientId: string, req: any, status?: string, active?: string): Promise<import("./schemas/prescription.schema").Prescription[]>;
    updatePrescriptionStatus(prescriptionId: string, status: string): Promise<import("./schemas/prescription.schema").Prescription>;
    updateMedicationAdherence(prescriptionId: string, medicationName: string, adherence: number): Promise<import("./schemas/prescription.schema").Prescription>;
    recordVitalSigns(data: CreateVitalSignsDto, req: any): Promise<import("./schemas/vital-signs.schema").VitalSigns>;
    getVitalSigns(patientId: string, req: any, startDate?: string, endDate?: string, limit?: string): Promise<import("./schemas/vital-signs.schema").VitalSigns[]>;
    getLatestVitals(patientId: string, req: any): Promise<import("./schemas/vital-signs.schema").VitalSigns | null>;
    createAppointment(data: CreateAppointmentDto, req: any): Promise<import("./schemas/appointment.schema").Appointment>;
    getAppointments(req: any, status?: string, startDate?: string, endDate?: string): Promise<import("./schemas/appointment.schema").Appointment[]>;
    updateAppointmentStatus(appointmentId: string, status: string, notes?: string): Promise<import("./schemas/appointment.schema").Appointment>;
    rescheduleAppointment(appointmentId: string, newDate: string, newTime: string): Promise<import("./schemas/appointment.schema").Appointment>;
    createMedicalScan(data: CreateMedicalScanDto, req: any): Promise<import("./schemas/medical-scan.schema").MedicalScan>;
    getMedicalScans(patientId: string, req: any, scanType?: string, status?: string): Promise<import("./schemas/medical-scan.schema").MedicalScan[]>;
    updateScanReport(scanId: string, report: any): Promise<import("./schemas/medical-scan.schema").MedicalScan>;
    addAiAnalysisToScan(scanId: string, analysis: any): Promise<import("./schemas/medical-scan.schema").MedicalScan>;
    getPatientHealthSummary(patientId: string, req: any): Promise<{
        patientId: string;
        latestVitals: import("./schemas/vital-signs.schema").VitalSigns | null;
        upcomingAppointments: import("./schemas/appointment.schema").Appointment[];
        activePrescriptions: import("./schemas/prescription.schema").Prescription[];
        recentScans: import("./schemas/medical-scan.schema").MedicalScan[];
        totalRecords: number;
        lastUpdated: Date;
    }>;
}

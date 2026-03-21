import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { MedicalRecord, RecordType, RecordStatus } from './schemas/medical-record.schema';
import { Prescription, PrescriptionStatus } from './schemas/prescription.schema';
import { VitalSigns } from './schemas/vital-signs.schema';
import { Appointment, AppointmentStatus } from './schemas/appointment.schema';
import { MedicalScan, ScanStatus } from './schemas/medical-scan.schema';

@Injectable()
export class MedicalRecordsService {
    constructor(
        @InjectModel(MedicalRecord.name) private medicalRecordModel: Model<MedicalRecord>,
        @InjectModel(Prescription.name) private prescriptionModel: Model<Prescription>,
        @InjectModel(VitalSigns.name) private vitalSignsModel: Model<VitalSigns>,
        @InjectModel(Appointment.name) private appointmentModel: Model<Appointment>,
        @InjectModel(MedicalScan.name) private medicalScanModel: Model<MedicalScan>,
    ) {}

    // ============ Medical Records ============

    async createMedicalRecord(data: Partial<MedicalRecord>): Promise<MedicalRecord> {
        const record = new this.medicalRecordModel(data);
        return record.save();
    }

    async getMedicalRecords(
        patientId: string,
        filters?: { type?: RecordType; status?: RecordStatus; startDate?: Date; endDate?: Date }
    ): Promise<MedicalRecord[]> {
        const query: any = { patientId: new Types.ObjectId(patientId) };

        if (filters?.type) query.type = filters.type;
        if (filters?.status) query.status = filters.status;
        if (filters?.startDate || filters?.endDate) {
            query.recordDate = {};
            if (filters.startDate) query.recordDate.$gte = filters.startDate;
            if (filters.endDate) query.recordDate.$lte = filters.endDate;
        }

        return this.medicalRecordModel
            .find(query)
            .populate('patientId', 'fullName email')
            .populate('doctorId', 'fullName email role')
            .sort({ recordDate: -1 })
            .exec();
    }

    async getMedicalRecordById(recordId: string, userId: string, userRole: string): Promise<MedicalRecord> {
        const record = await this.medicalRecordModel
            .findById(recordId)
            .populate('patientId', 'fullName email')
            .populate('doctorId', 'fullName email role')
            .exec();

        if (!record) {
            throw new NotFoundException('Medical record not found');
        }

        // Check permissions
        if (userRole === 'patient' && record.patientId.toString() !== userId) {
            throw new ForbiddenException('Access denied');
        }

        return record;
    }

    async updateMedicalRecord(recordId: string, data: Partial<MedicalRecord>): Promise<MedicalRecord> {
        const record = await this.medicalRecordModel.findByIdAndUpdate(
            recordId,
            { $set: data },
            { new: true }
        ).exec();

        if (!record) {
            throw new NotFoundException('Medical record not found');
        }

        return record;
    }

    async shareMedicalRecord(recordId: string, userIds: string[]): Promise<MedicalRecord> {
        const record = await this.medicalRecordModel.findByIdAndUpdate(
            recordId,
            { $addToSet: { sharedWith: { $each: userIds.map(id => new Types.ObjectId(id)) } } },
            { new: true }
        ).exec();

        if (!record) {
            throw new NotFoundException('Medical record not found');
        }

        return record;
    }

    // ============ Prescriptions ============

    async createPrescription(data: Partial<Prescription>): Promise<Prescription> {
        const prescription = new this.prescriptionModel(data);
        return prescription.save();
    }

    async getPrescriptions(
        patientId: string,
        filters?: { status?: PrescriptionStatus; active?: boolean }
    ): Promise<Prescription[]> {
        const query: any = { patientId: new Types.ObjectId(patientId) };

        if (filters?.status) query.status = filters.status;

        if (filters?.active) {
            query.status = PrescriptionStatus.ACTIVE;
            query['medications.endDate'] = { $gte: new Date() };
        }

        return this.prescriptionModel
            .find(query)
            .populate('patientId', 'fullName email')
            .populate('doctorId', 'fullName email role')
            .sort({ prescriptionDate: -1 })
            .exec();
    }

    async updatePrescriptionStatus(prescriptionId: string, status: PrescriptionStatus): Promise<Prescription> {
        const prescription = await this.prescriptionModel.findByIdAndUpdate(
            prescriptionId,
            { $set: { status } },
            { new: true }
        ).exec();

        if (!prescription) {
            throw new NotFoundException('Prescription not found');
        }

        return prescription;
    }

    async updateMedicationAdherence(prescriptionId: string, medicationName: string, adherence: number): Promise<Prescription> {
        const prescription = await this.prescriptionModel.findOneAndUpdate(
            { _id: prescriptionId, 'medications.name': medicationName },
            { $set: { 'medications.$.adherencePercentage': adherence } },
            { new: true }
        ).exec();

        if (!prescription) {
            throw new NotFoundException('Prescription or medication not found');
        }

        return prescription;
    }

    // ============ Vital Signs ============

    async recordVitalSigns(data: Partial<VitalSigns>): Promise<VitalSigns> {
        // Calculate BMI if height and weight are provided
        if (data.height && data.weight) {
            const heightInMeters = data.heightUnit === 'cm' ? data.height / 100 : data.height * 0.0254;
            const weightInKg = data.weightUnit === 'kg' ? data.weight : data.weight * 0.453592;
            data.bmi = Number((weightInKg / (heightInMeters * heightInMeters)).toFixed(2));
        }

        // Check for alerts
        const alerts: string[] = [];
        if (data.bloodPressure) {
            if (data.bloodPressure.systolic > 140 || data.bloodPressure.diastolic > 90) {
                alerts.push('high_bp');
            }
            if (data.bloodPressure.systolic < 90 || data.bloodPressure.diastolic < 60) {
                alerts.push('low_bp');
            }
        }
        if (data.heartRate) {
            if (data.heartRate > 100) alerts.push('high_heart_rate');
            if (data.heartRate < 60) alerts.push('low_heart_rate');
        }
        if (data.oxygenSaturation && data.oxygenSaturation < 95) {
            alerts.push('low_oxygen');
        }
        if (data.bloodGlucose) {
            if (data.bloodGlucose > 140) alerts.push('high_glucose');
            if (data.bloodGlucose < 70) alerts.push('low_glucose');
        }

        data.alerts = alerts.length > 0 ? alerts : undefined;

        const vitalSigns = new this.vitalSignsModel(data);
        return vitalSigns.save();
    }

    async getVitalSigns(
        patientId: string,
        filters?: { startDate?: Date; endDate?: Date; limit?: number }
    ): Promise<VitalSigns[]> {
        const query: any = { patientId: patientId };

        if (filters?.startDate || filters?.endDate) {
            query.recordedAt = {};
            if (filters.startDate) query.recordedAt.$gte = filters.startDate;
            if (filters.endDate) query.recordedAt.$lte = filters.endDate;
        }

        let queryBuilder = this.vitalSignsModel
            .find(query)
            .populate('patientId', 'fullName email')
            .populate('recordedBy', 'fullName email role')
            .sort({ recordedAt: -1 });

        if (filters?.limit) {
            queryBuilder = queryBuilder.limit(filters.limit);
        }

        return queryBuilder.exec();
    }

    async getLatestVitals(patientId: string): Promise<VitalSigns | null> {
        return this.vitalSignsModel
            .findOne({ patientId: patientId } as any)
            .sort({ recordedAt: -1 })
            .exec();
    }

    // ============ Appointments ============

    async createAppointment(data: Partial<Appointment>): Promise<Appointment> {
        const appointment = new this.appointmentModel(data);
        return appointment.save();
    }

    async getAppointments(
        userId: string,
        userRole: string,
        filters?: { status?: AppointmentStatus; startDate?: Date; endDate?: Date }
    ): Promise<Appointment[]> {
        const query: any = {};

        if (userRole === 'patient') {
            query.patientId = new Types.ObjectId(userId);
        } else if (userRole === 'doctor') {
            query.doctorId = new Types.ObjectId(userId);
        }

        if (filters?.status) query.status = filters.status;
        if (filters?.startDate || filters?.endDate) {
            query.scheduledDate = {};
            if (filters.startDate) query.scheduledDate.$gte = filters.startDate;
            if (filters.endDate) query.scheduledDate.$lte = filters.endDate;
        }

        return this.appointmentModel
            .find(query)
            .populate('patientId', 'fullName email phoneNumber')
            .populate('doctorId', 'fullName email phoneNumber')
            .sort({ scheduledDate: 1 })
            .exec();
    }

    async updateAppointmentStatus(appointmentId: string, status: AppointmentStatus, notes?: string): Promise<Appointment> {
        const updateData: any = { status };
        if (notes) updateData.doctorNotes = notes;
        if (status === AppointmentStatus.CANCELLED) {
            updateData.cancelledAt = new Date();
        }

        const appointment = await this.appointmentModel.findByIdAndUpdate(
            appointmentId,
            { $set: updateData },
            { new: true }
        ).exec();

        if (!appointment) {
            throw new NotFoundException('Appointment not found');
        }

        return appointment;
    }

    async rescheduleAppointment(appointmentId: string, newDate: Date, newTime: string): Promise<Appointment> {
        const appointment = await this.appointmentModel.findByIdAndUpdate(
            appointmentId,
            { 
                $set: { 
                    scheduledDate: newDate, 
                    scheduledTime: newTime,
                    status: AppointmentStatus.RESCHEDULED
                } 
            },
            { new: true }
        ).exec();

        if (!appointment) {
            throw new NotFoundException('Appointment not found');
        }

        return appointment;
    }

    // ============ Medical Scans ============

    async createMedicalScan(data: Partial<MedicalScan>): Promise<MedicalScan> {
        const scan = new this.medicalScanModel(data);
        return scan.save();
    }

    async getMedicalScans(
        patientId: string,
        filters?: { scanType?: string; status?: ScanStatus }
    ): Promise<MedicalScan[]> {
        const query: any = { patientId: new Types.ObjectId(patientId) };

        if (filters?.scanType) query.scanType = filters.scanType;
        if (filters?.status) query.status = filters.status;

        return this.medicalScanModel
            .find(query)
            .populate('patientId', 'fullName email')
            .populate('orderingDoctorId', 'fullName email role')
            .populate('radiologistId', 'fullName email role')
            .sort({ scanDate: -1 })
            .exec();
    }

    async updateScanReport(
        scanId: string,
        report: {
            radiologistReport?: string;
            findings?: any[];
            impression?: string;
            status?: ScanStatus;
        }
    ): Promise<MedicalScan> {
        const scan = await this.medicalScanModel.findByIdAndUpdate(
            scanId,
            { $set: report },
            { new: true }
        ).exec();

        if (!scan) {
            throw new NotFoundException('Medical scan not found');
        }

        return scan;
    }

    async addAiAnalysisToScan(scanId: string, analysis: any): Promise<MedicalScan> {
        const scan = await this.medicalScanModel.findByIdAndUpdate(
            scanId,
            { $set: { aiAnalysis: analysis } },
            { new: true }
        ).exec();

        if (!scan) {
            throw new NotFoundException('Medical scan not found');
        }

        return scan;
    }

    // ============ Analytics & Insights ============

    async getPatientHealthSummary(patientId: string) {
        const [latestVitals, activeAppointments, activePrescriptions, recentScans, medicalRecords] = await Promise.all([
            this.getLatestVitals(patientId),
            this.getAppointments(patientId, 'patient', { status: AppointmentStatus.SCHEDULED }),
            this.getPrescriptions(patientId, { active: true }),
            this.getMedicalScans(patientId),
            this.getMedicalRecords(patientId, { status: RecordStatus.VERIFIED }),
        ]);

        return {
            patientId,
            latestVitals,
            upcomingAppointments: activeAppointments.filter(a => new Date(a.scheduledDate) >= new Date()),
            activePrescriptions,
            recentScans: recentScans.slice(0, 5),
            totalRecords: medicalRecords.length,
            lastUpdated: new Date(),
        };
    }
}

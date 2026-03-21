"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicalRecordsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const medical_record_schema_1 = require("./schemas/medical-record.schema");
const prescription_schema_1 = require("./schemas/prescription.schema");
const vital_signs_schema_1 = require("./schemas/vital-signs.schema");
const appointment_schema_1 = require("./schemas/appointment.schema");
const medical_scan_schema_1 = require("./schemas/medical-scan.schema");
let MedicalRecordsService = class MedicalRecordsService {
    medicalRecordModel;
    prescriptionModel;
    vitalSignsModel;
    appointmentModel;
    medicalScanModel;
    constructor(medicalRecordModel, prescriptionModel, vitalSignsModel, appointmentModel, medicalScanModel) {
        this.medicalRecordModel = medicalRecordModel;
        this.prescriptionModel = prescriptionModel;
        this.vitalSignsModel = vitalSignsModel;
        this.appointmentModel = appointmentModel;
        this.medicalScanModel = medicalScanModel;
    }
    async createMedicalRecord(data) {
        const record = new this.medicalRecordModel(data);
        return record.save();
    }
    async getMedicalRecords(patientId, filters) {
        const query = { patientId: new mongoose_2.Types.ObjectId(patientId) };
        if (filters?.type)
            query.type = filters.type;
        if (filters?.status)
            query.status = filters.status;
        if (filters?.startDate || filters?.endDate) {
            query.recordDate = {};
            if (filters.startDate)
                query.recordDate.$gte = filters.startDate;
            if (filters.endDate)
                query.recordDate.$lte = filters.endDate;
        }
        return this.medicalRecordModel
            .find(query)
            .populate('patientId', 'fullName email')
            .populate('doctorId', 'fullName email role')
            .sort({ recordDate: -1 })
            .exec();
    }
    async getMedicalRecordById(recordId, userId, userRole) {
        const record = await this.medicalRecordModel
            .findById(recordId)
            .populate('patientId', 'fullName email')
            .populate('doctorId', 'fullName email role')
            .exec();
        if (!record) {
            throw new common_1.NotFoundException('Medical record not found');
        }
        if (userRole === 'patient' && record.patientId.toString() !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return record;
    }
    async updateMedicalRecord(recordId, data) {
        const record = await this.medicalRecordModel.findByIdAndUpdate(recordId, { $set: data }, { new: true }).exec();
        if (!record) {
            throw new common_1.NotFoundException('Medical record not found');
        }
        return record;
    }
    async shareMedicalRecord(recordId, userIds) {
        const record = await this.medicalRecordModel.findByIdAndUpdate(recordId, { $addToSet: { sharedWith: { $each: userIds.map(id => new mongoose_2.Types.ObjectId(id)) } } }, { new: true }).exec();
        if (!record) {
            throw new common_1.NotFoundException('Medical record not found');
        }
        return record;
    }
    async createPrescription(data) {
        const prescription = new this.prescriptionModel(data);
        return prescription.save();
    }
    async getPrescriptions(patientId, filters) {
        const query = { patientId: new mongoose_2.Types.ObjectId(patientId) };
        if (filters?.status)
            query.status = filters.status;
        if (filters?.active) {
            query.status = prescription_schema_1.PrescriptionStatus.ACTIVE;
            query['medications.endDate'] = { $gte: new Date() };
        }
        return this.prescriptionModel
            .find(query)
            .populate('patientId', 'fullName email')
            .populate('doctorId', 'fullName email role')
            .sort({ prescriptionDate: -1 })
            .exec();
    }
    async updatePrescriptionStatus(prescriptionId, status) {
        const prescription = await this.prescriptionModel.findByIdAndUpdate(prescriptionId, { $set: { status } }, { new: true }).exec();
        if (!prescription) {
            throw new common_1.NotFoundException('Prescription not found');
        }
        return prescription;
    }
    async updateMedicationAdherence(prescriptionId, medicationName, adherence) {
        const prescription = await this.prescriptionModel.findOneAndUpdate({ _id: prescriptionId, 'medications.name': medicationName }, { $set: { 'medications.$.adherencePercentage': adherence } }, { new: true }).exec();
        if (!prescription) {
            throw new common_1.NotFoundException('Prescription or medication not found');
        }
        return prescription;
    }
    async recordVitalSigns(data) {
        if (data.height && data.weight) {
            const heightInMeters = data.heightUnit === 'cm' ? data.height / 100 : data.height * 0.0254;
            const weightInKg = data.weightUnit === 'kg' ? data.weight : data.weight * 0.453592;
            data.bmi = Number((weightInKg / (heightInMeters * heightInMeters)).toFixed(2));
        }
        const alerts = [];
        if (data.bloodPressure) {
            if (data.bloodPressure.systolic > 140 || data.bloodPressure.diastolic > 90) {
                alerts.push('high_bp');
            }
            if (data.bloodPressure.systolic < 90 || data.bloodPressure.diastolic < 60) {
                alerts.push('low_bp');
            }
        }
        if (data.heartRate) {
            if (data.heartRate > 100)
                alerts.push('high_heart_rate');
            if (data.heartRate < 60)
                alerts.push('low_heart_rate');
        }
        if (data.oxygenSaturation && data.oxygenSaturation < 95) {
            alerts.push('low_oxygen');
        }
        if (data.bloodGlucose) {
            if (data.bloodGlucose > 140)
                alerts.push('high_glucose');
            if (data.bloodGlucose < 70)
                alerts.push('low_glucose');
        }
        data.alerts = alerts.length > 0 ? alerts : undefined;
        const vitalSigns = new this.vitalSignsModel(data);
        return vitalSigns.save();
    }
    async getVitalSigns(patientId, filters) {
        const query = { patientId: patientId };
        if (filters?.startDate || filters?.endDate) {
            query.recordedAt = {};
            if (filters.startDate)
                query.recordedAt.$gte = filters.startDate;
            if (filters.endDate)
                query.recordedAt.$lte = filters.endDate;
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
    async getLatestVitals(patientId) {
        return this.vitalSignsModel
            .findOne({ patientId: patientId })
            .sort({ recordedAt: -1 })
            .exec();
    }
    async createAppointment(data) {
        const appointment = new this.appointmentModel(data);
        return appointment.save();
    }
    async getAppointments(userId, userRole, filters) {
        const query = {};
        if (userRole === 'patient') {
            query.patientId = new mongoose_2.Types.ObjectId(userId);
        }
        else if (userRole === 'doctor') {
            query.doctorId = new mongoose_2.Types.ObjectId(userId);
        }
        if (filters?.status)
            query.status = filters.status;
        if (filters?.startDate || filters?.endDate) {
            query.scheduledDate = {};
            if (filters.startDate)
                query.scheduledDate.$gte = filters.startDate;
            if (filters.endDate)
                query.scheduledDate.$lte = filters.endDate;
        }
        return this.appointmentModel
            .find(query)
            .populate('patientId', 'fullName email phoneNumber')
            .populate('doctorId', 'fullName email phoneNumber')
            .sort({ scheduledDate: 1 })
            .exec();
    }
    async updateAppointmentStatus(appointmentId, status, notes) {
        const updateData = { status };
        if (notes)
            updateData.doctorNotes = notes;
        if (status === appointment_schema_1.AppointmentStatus.CANCELLED) {
            updateData.cancelledAt = new Date();
        }
        const appointment = await this.appointmentModel.findByIdAndUpdate(appointmentId, { $set: updateData }, { new: true }).exec();
        if (!appointment) {
            throw new common_1.NotFoundException('Appointment not found');
        }
        return appointment;
    }
    async rescheduleAppointment(appointmentId, newDate, newTime) {
        const appointment = await this.appointmentModel.findByIdAndUpdate(appointmentId, {
            $set: {
                scheduledDate: newDate,
                scheduledTime: newTime,
                status: appointment_schema_1.AppointmentStatus.RESCHEDULED
            }
        }, { new: true }).exec();
        if (!appointment) {
            throw new common_1.NotFoundException('Appointment not found');
        }
        return appointment;
    }
    async createMedicalScan(data) {
        const scan = new this.medicalScanModel(data);
        return scan.save();
    }
    async getMedicalScans(patientId, filters) {
        const query = { patientId: new mongoose_2.Types.ObjectId(patientId) };
        if (filters?.scanType)
            query.scanType = filters.scanType;
        if (filters?.status)
            query.status = filters.status;
        return this.medicalScanModel
            .find(query)
            .populate('patientId', 'fullName email')
            .populate('orderingDoctorId', 'fullName email role')
            .populate('radiologistId', 'fullName email role')
            .sort({ scanDate: -1 })
            .exec();
    }
    async updateScanReport(scanId, report) {
        const scan = await this.medicalScanModel.findByIdAndUpdate(scanId, { $set: report }, { new: true }).exec();
        if (!scan) {
            throw new common_1.NotFoundException('Medical scan not found');
        }
        return scan;
    }
    async addAiAnalysisToScan(scanId, analysis) {
        const scan = await this.medicalScanModel.findByIdAndUpdate(scanId, { $set: { aiAnalysis: analysis } }, { new: true }).exec();
        if (!scan) {
            throw new common_1.NotFoundException('Medical scan not found');
        }
        return scan;
    }
    async getPatientHealthSummary(patientId) {
        const [latestVitals, activeAppointments, activePrescriptions, recentScans, medicalRecords] = await Promise.all([
            this.getLatestVitals(patientId),
            this.getAppointments(patientId, 'patient', { status: appointment_schema_1.AppointmentStatus.SCHEDULED }),
            this.getPrescriptions(patientId, { active: true }),
            this.getMedicalScans(patientId),
            this.getMedicalRecords(patientId, { status: medical_record_schema_1.RecordStatus.VERIFIED }),
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
};
exports.MedicalRecordsService = MedicalRecordsService;
exports.MedicalRecordsService = MedicalRecordsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(medical_record_schema_1.MedicalRecord.name)),
    __param(1, (0, mongoose_1.InjectModel)(prescription_schema_1.Prescription.name)),
    __param(2, (0, mongoose_1.InjectModel)(vital_signs_schema_1.VitalSigns.name)),
    __param(3, (0, mongoose_1.InjectModel)(appointment_schema_1.Appointment.name)),
    __param(4, (0, mongoose_1.InjectModel)(medical_scan_schema_1.MedicalScan.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], MedicalRecordsService);
//# sourceMappingURL=medical-records.service.js.map
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
exports.MedicalRecordsController = void 0;
const common_1 = require("@nestjs/common");
const medical_records_service_1 = require("./medical-records.service");
const guards_1 = require("../auth/guards");
const decorators_1 = require("../auth/decorators");
const user_schema_1 = require("../users/schemas/user.schema");
const dto_1 = require("./dto");
let MedicalRecordsController = class MedicalRecordsController {
    medicalRecordsService;
    constructor(medicalRecordsService) {
        this.medicalRecordsService = medicalRecordsService;
    }
    async createMedicalRecord(data, req) {
        return this.medicalRecordsService.createMedicalRecord({
            ...data,
            doctorId: req.user.userId,
        });
    }
    async getMedicalRecords(patientId, req, type, status, startDate, endDate) {
        if (req.user.role === user_schema_1.UserRole.PATIENT && req.user.userId !== patientId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.medicalRecordsService.getMedicalRecords(patientId, {
            type: type,
            status: status,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
        });
    }
    async getMedicalRecordById(recordId, req) {
        return this.medicalRecordsService.getMedicalRecordById(recordId, req.user.userId, req.user.role);
    }
    async updateMedicalRecord(recordId, data) {
        return this.medicalRecordsService.updateMedicalRecord(recordId, data);
    }
    async shareMedicalRecord(recordId, userIds) {
        return this.medicalRecordsService.shareMedicalRecord(recordId, userIds);
    }
    async createPrescription(data, req) {
        return this.medicalRecordsService.createPrescription({
            ...data,
            doctorId: req.user.userId,
        });
    }
    async getPrescriptions(patientId, req, status, active) {
        if (req.user.role === user_schema_1.UserRole.PATIENT && req.user.userId !== patientId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.medicalRecordsService.getPrescriptions(patientId, {
            status: status,
            active: active === 'true',
        });
    }
    async updatePrescriptionStatus(prescriptionId, status) {
        return this.medicalRecordsService.updatePrescriptionStatus(prescriptionId, status);
    }
    async updateMedicationAdherence(prescriptionId, medicationName, adherence) {
        return this.medicalRecordsService.updateMedicationAdherence(prescriptionId, medicationName, adherence);
    }
    async recordVitalSigns(data, req) {
        return this.medicalRecordsService.recordVitalSigns({
            ...data,
            recordedBy: req.user.userId,
        });
    }
    async getVitalSigns(patientId, req, startDate, endDate, limit) {
        if (req.user.role === user_schema_1.UserRole.PATIENT && req.user.userId !== patientId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.medicalRecordsService.getVitalSigns(patientId, {
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
            limit: limit ? parseInt(limit) : undefined,
        });
    }
    async getLatestVitals(patientId, req) {
        if (req.user.role === user_schema_1.UserRole.PATIENT && req.user.userId !== patientId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.medicalRecordsService.getLatestVitals(patientId);
    }
    async createAppointment(data, req) {
        return this.medicalRecordsService.createAppointment(data);
    }
    async getAppointments(req, status, startDate, endDate) {
        return this.medicalRecordsService.getAppointments(req.user.userId, req.user.role, {
            status: status,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
        });
    }
    async updateAppointmentStatus(appointmentId, status, notes) {
        return this.medicalRecordsService.updateAppointmentStatus(appointmentId, status, notes);
    }
    async rescheduleAppointment(appointmentId, newDate, newTime) {
        return this.medicalRecordsService.rescheduleAppointment(appointmentId, new Date(newDate), newTime);
    }
    async createMedicalScan(data, req) {
        return this.medicalRecordsService.createMedicalScan({
            ...data,
            orderingDoctorId: req.user.userId,
        });
    }
    async getMedicalScans(patientId, req, scanType, status) {
        if (req.user.role === user_schema_1.UserRole.PATIENT && req.user.userId !== patientId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.medicalRecordsService.getMedicalScans(patientId, {
            scanType: scanType,
            status: status,
        });
    }
    async updateScanReport(scanId, report) {
        return this.medicalRecordsService.updateScanReport(scanId, report);
    }
    async addAiAnalysisToScan(scanId, analysis) {
        return this.medicalRecordsService.addAiAnalysisToScan(scanId, analysis);
    }
    async getPatientHealthSummary(patientId, req) {
        if (req.user.role === user_schema_1.UserRole.PATIENT && req.user.userId !== patientId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.medicalRecordsService.getPatientHealthSummary(patientId);
    }
};
exports.MedicalRecordsController = MedicalRecordsController;
__decorate([
    (0, common_1.Post)(),
    (0, decorators_1.Roles)(user_schema_1.UserRole.DOCTOR, user_schema_1.UserRole.ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateMedicalRecordDto, Object]),
    __metadata("design:returntype", Promise)
], MedicalRecordsController.prototype, "createMedicalRecord", null);
__decorate([
    (0, common_1.Get)('patient/:patientId'),
    (0, decorators_1.Roles)(user_schema_1.UserRole.DOCTOR, user_schema_1.UserRole.PATIENT, user_schema_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('patientId')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Query)('type')),
    __param(3, (0, common_1.Query)('status')),
    __param(4, (0, common_1.Query)('startDate')),
    __param(5, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String, String, String, String]),
    __metadata("design:returntype", Promise)
], MedicalRecordsController.prototype, "getMedicalRecords", null);
__decorate([
    (0, common_1.Get)(':recordId'),
    (0, decorators_1.Roles)(user_schema_1.UserRole.DOCTOR, user_schema_1.UserRole.PATIENT, user_schema_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('recordId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MedicalRecordsController.prototype, "getMedicalRecordById", null);
__decorate([
    (0, common_1.Put)(':recordId'),
    (0, decorators_1.Roles)(user_schema_1.UserRole.DOCTOR, user_schema_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('recordId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MedicalRecordsController.prototype, "updateMedicalRecord", null);
__decorate([
    (0, common_1.Post)(':recordId/share'),
    (0, decorators_1.Roles)(user_schema_1.UserRole.PATIENT, user_schema_1.UserRole.DOCTOR, user_schema_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('recordId')),
    __param(1, (0, common_1.Body)('userIds')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", Promise)
], MedicalRecordsController.prototype, "shareMedicalRecord", null);
__decorate([
    (0, common_1.Post)('prescriptions'),
    (0, decorators_1.Roles)(user_schema_1.UserRole.DOCTOR, user_schema_1.UserRole.ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreatePrescriptionDto, Object]),
    __metadata("design:returntype", Promise)
], MedicalRecordsController.prototype, "createPrescription", null);
__decorate([
    (0, common_1.Get)('prescriptions/patient/:patientId'),
    (0, decorators_1.Roles)(user_schema_1.UserRole.DOCTOR, user_schema_1.UserRole.PATIENT, user_schema_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('patientId')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('active')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String, String]),
    __metadata("design:returntype", Promise)
], MedicalRecordsController.prototype, "getPrescriptions", null);
__decorate([
    (0, common_1.Put)('prescriptions/:prescriptionId/status'),
    (0, decorators_1.Roles)(user_schema_1.UserRole.DOCTOR, user_schema_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('prescriptionId')),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], MedicalRecordsController.prototype, "updatePrescriptionStatus", null);
__decorate([
    (0, common_1.Put)('prescriptions/:prescriptionId/adherence'),
    (0, decorators_1.Roles)(user_schema_1.UserRole.PATIENT, user_schema_1.UserRole.DOCTOR, user_schema_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('prescriptionId')),
    __param(1, (0, common_1.Body)('medicationName')),
    __param(2, (0, common_1.Body)('adherence')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number]),
    __metadata("design:returntype", Promise)
], MedicalRecordsController.prototype, "updateMedicationAdherence", null);
__decorate([
    (0, common_1.Post)('vitals'),
    (0, decorators_1.Roles)(user_schema_1.UserRole.PATIENT, user_schema_1.UserRole.DOCTOR, user_schema_1.UserRole.NURSE, user_schema_1.UserRole.ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateVitalSignsDto, Object]),
    __metadata("design:returntype", Promise)
], MedicalRecordsController.prototype, "recordVitalSigns", null);
__decorate([
    (0, common_1.Get)('vitals/patient/:patientId'),
    (0, decorators_1.Roles)(user_schema_1.UserRole.DOCTOR, user_schema_1.UserRole.PATIENT, user_schema_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('patientId')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Query)('startDate')),
    __param(3, (0, common_1.Query)('endDate')),
    __param(4, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String, String, String]),
    __metadata("design:returntype", Promise)
], MedicalRecordsController.prototype, "getVitalSigns", null);
__decorate([
    (0, common_1.Get)('vitals/patient/:patientId/latest'),
    (0, decorators_1.Roles)(user_schema_1.UserRole.DOCTOR, user_schema_1.UserRole.PATIENT, user_schema_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('patientId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MedicalRecordsController.prototype, "getLatestVitals", null);
__decorate([
    (0, common_1.Post)('appointments'),
    (0, decorators_1.Roles)(user_schema_1.UserRole.PATIENT, user_schema_1.UserRole.DOCTOR, user_schema_1.UserRole.ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateAppointmentDto, Object]),
    __metadata("design:returntype", Promise)
], MedicalRecordsController.prototype, "createAppointment", null);
__decorate([
    (0, common_1.Get)('appointments'),
    (0, decorators_1.Roles)(user_schema_1.UserRole.DOCTOR, user_schema_1.UserRole.PATIENT, user_schema_1.UserRole.ADMIN),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('startDate')),
    __param(3, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], MedicalRecordsController.prototype, "getAppointments", null);
__decorate([
    (0, common_1.Put)('appointments/:appointmentId/status'),
    (0, decorators_1.Roles)(user_schema_1.UserRole.DOCTOR, user_schema_1.UserRole.PATIENT, user_schema_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('appointmentId')),
    __param(1, (0, common_1.Body)('status')),
    __param(2, (0, common_1.Body)('notes')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], MedicalRecordsController.prototype, "updateAppointmentStatus", null);
__decorate([
    (0, common_1.Put)('appointments/:appointmentId/reschedule'),
    (0, decorators_1.Roles)(user_schema_1.UserRole.PATIENT, user_schema_1.UserRole.DOCTOR, user_schema_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('appointmentId')),
    __param(1, (0, common_1.Body)('newDate')),
    __param(2, (0, common_1.Body)('newTime')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], MedicalRecordsController.prototype, "rescheduleAppointment", null);
__decorate([
    (0, common_1.Post)('scans'),
    (0, decorators_1.Roles)(user_schema_1.UserRole.DOCTOR, user_schema_1.UserRole.ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateMedicalScanDto, Object]),
    __metadata("design:returntype", Promise)
], MedicalRecordsController.prototype, "createMedicalScan", null);
__decorate([
    (0, common_1.Get)('scans/patient/:patientId'),
    (0, decorators_1.Roles)(user_schema_1.UserRole.DOCTOR, user_schema_1.UserRole.PATIENT, user_schema_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('patientId')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Query)('scanType')),
    __param(3, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String, String]),
    __metadata("design:returntype", Promise)
], MedicalRecordsController.prototype, "getMedicalScans", null);
__decorate([
    (0, common_1.Put)('scans/:scanId/report'),
    (0, decorators_1.Roles)(user_schema_1.UserRole.DOCTOR, user_schema_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('scanId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MedicalRecordsController.prototype, "updateScanReport", null);
__decorate([
    (0, common_1.Put)('scans/:scanId/ai-analysis'),
    (0, decorators_1.Roles)(user_schema_1.UserRole.DOCTOR, user_schema_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('scanId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MedicalRecordsController.prototype, "addAiAnalysisToScan", null);
__decorate([
    (0, common_1.Get)('summary/patient/:patientId'),
    (0, decorators_1.Roles)(user_schema_1.UserRole.DOCTOR, user_schema_1.UserRole.PATIENT, user_schema_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('patientId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MedicalRecordsController.prototype, "getPatientHealthSummary", null);
exports.MedicalRecordsController = MedicalRecordsController = __decorate([
    (0, common_1.Controller)('medical-records'),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    __metadata("design:paramtypes", [medical_records_service_1.MedicalRecordsService])
], MedicalRecordsController);
//# sourceMappingURL=medical-records.controller.js.map
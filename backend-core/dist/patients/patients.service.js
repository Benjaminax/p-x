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
exports.PatientsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../users/schemas/user.schema");
const allergy_schema_1 = require("./schemas/allergy.schema");
const patient_profile_schema_1 = require("./schemas/patient-profile.schema");
let PatientsService = class PatientsService {
    patientProfileModel;
    allergyModel;
    constructor(patientProfileModel, allergyModel) {
        this.patientProfileModel = patientProfileModel;
        this.allergyModel = allergyModel;
    }
    async getOwnProfile(userId) {
        const patient = await this.findPatientByUserId(userId);
        if (!patient) {
            throw new common_1.NotFoundException('Patient profile not found');
        }
        return patient;
    }
    async updateOwnProfile(userId, payload) {
        const patient = await this.findPatientByUserId(userId);
        if (!patient) {
            throw new common_1.NotFoundException('Patient profile not found');
        }
        if (payload.dateOfBirth) {
            payload.dateOfBirth = new Date(payload.dateOfBirth);
        }
        await this.patientProfileModel.findByIdAndUpdate(patient._id, payload).exec();
        const updated = await this.patientProfileModel.findById(patient._id).exec();
        if (!updated) {
            throw new common_1.NotFoundException('Patient profile not found');
        }
        return updated;
    }
    async getOfflinePack(userId) {
        const profile = await this.getOwnProfile(userId);
        const allergies = await this.allergyModel
            .find({ patientId: profile._id, deletedAt: { $exists: false } })
            .sort({ createdAt: -1 })
            .exec();
        return {
            profile,
            allergies,
            bloodType: profile.bloodType || null,
            genotype: profile.genotype || null,
            currentMedications: [],
            activePrescriptions: [],
            emergencyContact: {
                name: profile.emergencyContactName || null,
                phone: profile.emergencyContactPhone || null,
            },
            medicalRecords: [],
            insuranceCard: {
                provider: profile.healthInsuranceProvider || null,
                number: profile.healthInsuranceNumber || null,
                cardUrl: profile.insuranceCardUrl || null,
            },
            lastSynced: new Date().toISOString(),
        };
    }
    async getOwnAllergies(userId) {
        const patient = await this.findPatientByUserId(userId);
        if (!patient) {
            throw new common_1.NotFoundException('Patient profile not found');
        }
        return this.allergyModel
            .find({ patientId: patient._id, deletedAt: { $exists: false } })
            .sort({ createdAt: -1 })
            .exec();
    }
    async addAllergy(userId, payload) {
        const patient = await this.findPatientByUserId(userId);
        if (!patient) {
            throw new common_1.NotFoundException('Patient profile not found');
        }
        const allergy = new this.allergyModel({
            ...payload,
            patientId: patient._id,
            verifiedByLab: payload.verifiedByLab ?? false,
        });
        return allergy.save();
    }
    async removeAllergy(userId, allergyId) {
        const patient = await this.findPatientByUserId(userId);
        if (!patient) {
            throw new common_1.NotFoundException('Patient profile not found');
        }
        if (!mongoose_2.Types.ObjectId.isValid(allergyId)) {
            throw new common_1.BadRequestException('Invalid allergy id');
        }
        const allergy = await this.allergyModel.findById(allergyId).exec();
        if (!allergy || allergy.deletedAt) {
            throw new common_1.NotFoundException('Allergy not found');
        }
        if (String(allergy.patientId) !== String(patient._id)) {
            throw new common_1.ForbiddenException('Access denied');
        }
        allergy.deletedAt = new Date();
        await allergy.save();
        return { success: true };
    }
    assertPatientRole(role) {
        if (role !== user_schema_1.UserRole.PATIENT) {
            throw new common_1.ForbiddenException('Patient access required');
        }
    }
    async findPatientByUserId(userId) {
        if (!mongoose_2.Types.ObjectId.isValid(userId)) {
            throw new common_1.BadRequestException('Invalid user id');
        }
        return this.patientProfileModel.findOne({
            userId: new mongoose_2.Types.ObjectId(userId),
            deletedAt: { $exists: false },
        }).exec();
    }
};
exports.PatientsService = PatientsService;
exports.PatientsService = PatientsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(patient_profile_schema_1.PatientProfile.name)),
    __param(1, (0, mongoose_1.InjectModel)(allergy_schema_1.Allergy.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], PatientsService);
//# sourceMappingURL=patients.service.js.map
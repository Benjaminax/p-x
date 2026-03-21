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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientProfileSchema = exports.PatientProfile = exports.Genotype = exports.BloodType = exports.Gender = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var Gender;
(function (Gender) {
    Gender["MALE"] = "male";
    Gender["FEMALE"] = "female";
    Gender["OTHER"] = "other";
})(Gender || (exports.Gender = Gender = {}));
var BloodType;
(function (BloodType) {
    BloodType["A_POS"] = "A+";
    BloodType["A_NEG"] = "A-";
    BloodType["B_POS"] = "B+";
    BloodType["B_NEG"] = "B-";
    BloodType["AB_POS"] = "AB+";
    BloodType["AB_NEG"] = "AB-";
    BloodType["O_POS"] = "O+";
    BloodType["O_NEG"] = "O-";
})(BloodType || (exports.BloodType = BloodType = {}));
var Genotype;
(function (Genotype) {
    Genotype["AA"] = "AA";
    Genotype["AS"] = "AS";
    Genotype["SS"] = "SS";
    Genotype["AC"] = "AC";
    Genotype["SC"] = "SC";
})(Genotype || (exports.Genotype = Genotype = {}));
let PatientProfile = class PatientProfile extends mongoose_2.Document {
    userId;
    firstName;
    lastName;
    dateOfBirth;
    gender;
    bloodType;
    genotype;
    heightCm;
    weightKg;
    profilePhotoUrl;
    emergencyContactName;
    emergencyContactPhone;
    healthInsuranceProvider;
    healthInsuranceNumber;
    insuranceCardUrl;
    qrCodeUrl;
    isOfflineSyncEnabled;
    deletedAt;
};
exports.PatientProfile = PatientProfile;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'User', required: true, unique: true }),
    __metadata("design:type", mongoose_2.Schema.Types.ObjectId)
], PatientProfile.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], PatientProfile.prototype, "firstName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], PatientProfile.prototype, "lastName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], PatientProfile.prototype, "dateOfBirth", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: Gender }),
    __metadata("design:type", String)
], PatientProfile.prototype, "gender", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: BloodType }),
    __metadata("design:type", String)
], PatientProfile.prototype, "bloodType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: Genotype }),
    __metadata("design:type", String)
], PatientProfile.prototype, "genotype", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], PatientProfile.prototype, "heightCm", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], PatientProfile.prototype, "weightKg", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], PatientProfile.prototype, "profilePhotoUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], PatientProfile.prototype, "emergencyContactName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], PatientProfile.prototype, "emergencyContactPhone", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], PatientProfile.prototype, "healthInsuranceProvider", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], PatientProfile.prototype, "healthInsuranceNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], PatientProfile.prototype, "insuranceCardUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], PatientProfile.prototype, "qrCodeUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], PatientProfile.prototype, "isOfflineSyncEnabled", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], PatientProfile.prototype, "deletedAt", void 0);
exports.PatientProfile = PatientProfile = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], PatientProfile);
exports.PatientProfileSchema = mongoose_1.SchemaFactory.createForClass(PatientProfile);
exports.PatientProfileSchema.index({ userId: 1 }, { unique: true });
exports.PatientProfileSchema.index({ deletedAt: 1 });
//# sourceMappingURL=patient-profile.schema.js.map
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
exports.PrescriptionSchema = exports.Prescription = exports.Medication = exports.Frequency = exports.PrescriptionStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var PrescriptionStatus;
(function (PrescriptionStatus) {
    PrescriptionStatus["ACTIVE"] = "active";
    PrescriptionStatus["COMPLETED"] = "completed";
    PrescriptionStatus["CANCELLED"] = "cancelled";
    PrescriptionStatus["EXPIRED"] = "expired";
})(PrescriptionStatus || (exports.PrescriptionStatus = PrescriptionStatus = {}));
var Frequency;
(function (Frequency) {
    Frequency["ONCE_DAILY"] = "once_daily";
    Frequency["TWICE_DAILY"] = "twice_daily";
    Frequency["THREE_TIMES_DAILY"] = "three_times_daily";
    Frequency["FOUR_TIMES_DAILY"] = "four_times_daily";
    Frequency["AS_NEEDED"] = "as_needed";
    Frequency["WEEKLY"] = "weekly";
    Frequency["CUSTOM"] = "custom";
})(Frequency || (exports.Frequency = Frequency = {}));
let Medication = class Medication {
    name;
    dosage;
    frequency;
    customFrequency;
    startDate;
    endDate;
    instructions;
    sideEffects;
    adherencePercentage;
};
exports.Medication = Medication;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Medication.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Medication.prototype, "dosage", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: Frequency }),
    __metadata("design:type", String)
], Medication.prototype, "frequency", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Medication.prototype, "customFrequency", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], Medication.prototype, "startDate", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Medication.prototype, "endDate", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Medication.prototype, "instructions", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String] }),
    __metadata("design:type", Array)
], Medication.prototype, "sideEffects", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Medication.prototype, "adherencePercentage", void 0);
exports.Medication = Medication = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], Medication);
const MedicationSchema = mongoose_1.SchemaFactory.createForClass(Medication);
let Prescription = class Prescription extends mongoose_2.Document {
    patientId;
    doctorId;
    medications;
    prescriptionDate;
    status;
    notes;
    diagnosis;
    attachments;
    refillsRemaining;
    pharmacyName;
    pharmacyPhone;
    digitalSignature;
    isVerified;
};
exports.Prescription = Prescription;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Schema.Types.ObjectId)
], Prescription.prototype, "patientId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Schema.Types.ObjectId)
], Prescription.prototype, "doctorId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [MedicationSchema], required: true }),
    __metadata("design:type", Array)
], Prescription.prototype, "medications", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], Prescription.prototype, "prescriptionDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: PrescriptionStatus, default: PrescriptionStatus.ACTIVE }),
    __metadata("design:type", String)
], Prescription.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Prescription.prototype, "notes", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Prescription.prototype, "diagnosis", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String] }),
    __metadata("design:type", Array)
], Prescription.prototype, "attachments", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Prescription.prototype, "refillsRemaining", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Prescription.prototype, "pharmacyName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Prescription.prototype, "pharmacyPhone", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Prescription.prototype, "digitalSignature", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Prescription.prototype, "isVerified", void 0);
exports.Prescription = Prescription = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Prescription);
exports.PrescriptionSchema = mongoose_1.SchemaFactory.createForClass(Prescription);
exports.PrescriptionSchema.index({ patientId: 1, prescriptionDate: -1 });
exports.PrescriptionSchema.index({ doctorId: 1 });
exports.PrescriptionSchema.index({ status: 1 });
//# sourceMappingURL=prescription.schema.js.map
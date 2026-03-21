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
exports.VitalSignsSchema = exports.VitalSigns = exports.BloodPressure = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let BloodPressure = class BloodPressure {
    systolic;
    diastolic;
    unit;
};
exports.BloodPressure = BloodPressure;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], BloodPressure.prototype, "systolic", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], BloodPressure.prototype, "diastolic", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], BloodPressure.prototype, "unit", void 0);
exports.BloodPressure = BloodPressure = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], BloodPressure);
const BloodPressureSchema = mongoose_1.SchemaFactory.createForClass(BloodPressure);
let VitalSigns = class VitalSigns extends mongoose_2.Document {
    patientId;
    recordedAt;
    bloodPressure;
    heartRate;
    temperature;
    temperatureUnit;
    respiratoryRate;
    oxygenSaturation;
    weight;
    weightUnit;
    height;
    heightUnit;
    bmi;
    bloodGlucose;
    glucoseUnit;
    painLevel;
    notes;
    recordedBy;
    location;
    symptoms;
    aiInsights;
    alerts;
};
exports.VitalSigns = VitalSigns;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Schema.Types.ObjectId)
], VitalSigns.prototype, "patientId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], VitalSigns.prototype, "recordedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: BloodPressureSchema }),
    __metadata("design:type", BloodPressure)
], VitalSigns.prototype, "bloodPressure", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], VitalSigns.prototype, "heartRate", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], VitalSigns.prototype, "temperature", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'C' }),
    __metadata("design:type", String)
], VitalSigns.prototype, "temperatureUnit", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], VitalSigns.prototype, "respiratoryRate", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], VitalSigns.prototype, "oxygenSaturation", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], VitalSigns.prototype, "weight", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'kg' }),
    __metadata("design:type", String)
], VitalSigns.prototype, "weightUnit", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], VitalSigns.prototype, "height", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'cm' }),
    __metadata("design:type", String)
], VitalSigns.prototype, "heightUnit", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], VitalSigns.prototype, "bmi", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], VitalSigns.prototype, "bloodGlucose", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'mg/dL' }),
    __metadata("design:type", String)
], VitalSigns.prototype, "glucoseUnit", void 0);
__decorate([
    (0, mongoose_1.Prop)({ min: 0, max: 10 }),
    __metadata("design:type", Number)
], VitalSigns.prototype, "painLevel", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], VitalSigns.prototype, "notes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.Schema.Types.ObjectId)
], VitalSigns.prototype, "recordedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], VitalSigns.prototype, "location", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String] }),
    __metadata("design:type", Array)
], VitalSigns.prototype, "symptoms", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], VitalSigns.prototype, "aiInsights", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String] }),
    __metadata("design:type", Array)
], VitalSigns.prototype, "alerts", void 0);
exports.VitalSigns = VitalSigns = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], VitalSigns);
exports.VitalSignsSchema = mongoose_1.SchemaFactory.createForClass(VitalSigns);
exports.VitalSignsSchema.index({ patientId: 1, recordedAt: -1 });
exports.VitalSignsSchema.index({ patientId: 1, alerts: 1 });
//# sourceMappingURL=vital-signs.schema.js.map
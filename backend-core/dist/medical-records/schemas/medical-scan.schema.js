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
exports.MedicalScanSchema = exports.MedicalScan = exports.AIAnalysis = exports.Finding = exports.ScanStatus = exports.ScanType = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var ScanType;
(function (ScanType) {
    ScanType["XRAY"] = "xray";
    ScanType["CT_SCAN"] = "ct_scan";
    ScanType["MRI"] = "mri";
    ScanType["ULTRASOUND"] = "ultrasound";
    ScanType["PET_SCAN"] = "pet_scan";
    ScanType["MAMMOGRAM"] = "mammogram";
    ScanType["BONE_SCAN"] = "bone_scan";
    ScanType["DEXA_SCAN"] = "dexa_scan";
    ScanType["OTHER"] = "other";
})(ScanType || (exports.ScanType = ScanType = {}));
var ScanStatus;
(function (ScanStatus) {
    ScanStatus["PENDING_REVIEW"] = "pending_review";
    ScanStatus["REVIEWED"] = "reviewed";
    ScanStatus["REQUIRES_FOLLOWUP"] = "requires_followup";
    ScanStatus["NORMAL"] = "normal";
    ScanStatus["ABNORMAL"] = "abnormal";
})(ScanStatus || (exports.ScanStatus = ScanStatus = {}));
let Finding = class Finding {
    description;
    location;
    severity;
    measurements;
    isCritical;
};
exports.Finding = Finding;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Finding.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Finding.prototype, "location", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Finding.prototype, "severity", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Finding.prototype, "measurements", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Finding.prototype, "isCritical", void 0);
exports.Finding = Finding = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], Finding);
const FindingSchema = mongoose_1.SchemaFactory.createForClass(Finding);
let AIAnalysis = class AIAnalysis {
    model;
    confidence;
    detectedAnomalies;
    summary;
    recommendations;
    analysisDate;
};
exports.AIAnalysis = AIAnalysis;
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], AIAnalysis.prototype, "model", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], AIAnalysis.prototype, "confidence", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String] }),
    __metadata("design:type", Array)
], AIAnalysis.prototype, "detectedAnomalies", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], AIAnalysis.prototype, "summary", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], AIAnalysis.prototype, "recommendations", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], AIAnalysis.prototype, "analysisDate", void 0);
exports.AIAnalysis = AIAnalysis = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], AIAnalysis);
const AIAnalysisSchema = mongoose_1.SchemaFactory.createForClass(AIAnalysis);
let MedicalScan = class MedicalScan extends mongoose_2.Document {
    patientId;
    orderingDoctorId;
    radiologistId;
    scanDate;
    scanType;
    bodyPart;
    status;
    imageUrls;
    imageFormats;
    thumbnailUrl;
    reportPdfUrl;
    radiologistReport;
    findings;
    impression;
    clinicalHistory;
    indication;
    aiAnalysis;
    facilityName;
    facilityAddress;
    radiologistName;
    technique;
    contrastUsed;
    contrastType;
    followUpRequired;
    followUpDate;
    followUpInstructions;
    comparedWithScanId;
    comparisonNotes;
    dicomMetadata;
    isEncrypted;
    encryptionKeyId;
    patientNotified;
    patientNotifiedAt;
};
exports.MedicalScan = MedicalScan;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Schema.Types.ObjectId)
], MedicalScan.prototype, "patientId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.Schema.Types.ObjectId)
], MedicalScan.prototype, "orderingDoctorId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.Schema.Types.ObjectId)
], MedicalScan.prototype, "radiologistId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], MedicalScan.prototype, "scanDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: ScanType, required: true }),
    __metadata("design:type", String)
], MedicalScan.prototype, "scanType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], MedicalScan.prototype, "bodyPart", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: ScanStatus, default: ScanStatus.PENDING_REVIEW }),
    __metadata("design:type", String)
], MedicalScan.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], required: true }),
    __metadata("design:type", Array)
], MedicalScan.prototype, "imageUrls", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String] }),
    __metadata("design:type", Array)
], MedicalScan.prototype, "imageFormats", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], MedicalScan.prototype, "thumbnailUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], MedicalScan.prototype, "reportPdfUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], MedicalScan.prototype, "radiologistReport", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [FindingSchema] }),
    __metadata("design:type", Array)
], MedicalScan.prototype, "findings", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], MedicalScan.prototype, "impression", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], MedicalScan.prototype, "clinicalHistory", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], MedicalScan.prototype, "indication", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: AIAnalysisSchema }),
    __metadata("design:type", AIAnalysis)
], MedicalScan.prototype, "aiAnalysis", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], MedicalScan.prototype, "facilityName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], MedicalScan.prototype, "facilityAddress", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], MedicalScan.prototype, "radiologistName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], MedicalScan.prototype, "technique", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Boolean)
], MedicalScan.prototype, "contrastUsed", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], MedicalScan.prototype, "contrastType", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Boolean)
], MedicalScan.prototype, "followUpRequired", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], MedicalScan.prototype, "followUpDate", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], MedicalScan.prototype, "followUpInstructions", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'MedicalScan' }),
    __metadata("design:type", mongoose_2.Schema.Types.ObjectId)
], MedicalScan.prototype, "comparedWithScanId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], MedicalScan.prototype, "comparisonNotes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], MedicalScan.prototype, "dicomMetadata", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], MedicalScan.prototype, "isEncrypted", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], MedicalScan.prototype, "encryptionKeyId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], MedicalScan.prototype, "patientNotified", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], MedicalScan.prototype, "patientNotifiedAt", void 0);
exports.MedicalScan = MedicalScan = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], MedicalScan);
exports.MedicalScanSchema = mongoose_1.SchemaFactory.createForClass(MedicalScan);
exports.MedicalScanSchema.index({ patientId: 1, scanDate: -1 });
exports.MedicalScanSchema.index({ orderingDoctorId: 1, scanDate: -1 });
exports.MedicalScanSchema.index({ radiologistId: 1, status: 1 });
exports.MedicalScanSchema.index({ status: 1, scanDate: -1 });
//# sourceMappingURL=medical-scan.schema.js.map
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
exports.MedicalRecordSchema = exports.MedicalRecord = exports.RecordStatus = exports.RecordType = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var RecordType;
(function (RecordType) {
    RecordType["LAB_RESULT"] = "lab_result";
    RecordType["IMAGING"] = "imaging";
    RecordType["PRESCRIPTION"] = "prescription";
    RecordType["VISIT_SUMMARY"] = "visit_summary";
    RecordType["VACCINATION"] = "vaccination";
    RecordType["SURGERY"] = "surgery";
    RecordType["OTHER"] = "other";
})(RecordType || (exports.RecordType = RecordType = {}));
var RecordStatus;
(function (RecordStatus) {
    RecordStatus["PENDING"] = "pending";
    RecordStatus["VERIFIED"] = "verified";
    RecordStatus["ARCHIVED"] = "archived";
})(RecordStatus || (exports.RecordStatus = RecordStatus = {}));
let MedicalRecord = class MedicalRecord extends mongoose_2.Document {
    patientId;
    doctorId;
    title;
    description;
    type;
    status;
    recordDate;
    structuredData;
    attachmentUrls;
    attachmentTypes;
    ocrText;
    aiSummary;
    tags;
    sharedWith;
    language;
    translatedContent;
    encryptionKeyId;
    isEncrypted;
    facilityName;
    facilityId;
};
exports.MedicalRecord = MedicalRecord;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Schema.Types.ObjectId)
], MedicalRecord.prototype, "patientId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.Schema.Types.ObjectId)
], MedicalRecord.prototype, "doctorId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], MedicalRecord.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], MedicalRecord.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: RecordType }),
    __metadata("design:type", String)
], MedicalRecord.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: RecordStatus, default: RecordStatus.PENDING }),
    __metadata("design:type", String)
], MedicalRecord.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], MedicalRecord.prototype, "recordDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], MedicalRecord.prototype, "structuredData", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String] }),
    __metadata("design:type", Array)
], MedicalRecord.prototype, "attachmentUrls", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String] }),
    __metadata("design:type", Array)
], MedicalRecord.prototype, "attachmentTypes", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], MedicalRecord.prototype, "ocrText", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], MedicalRecord.prototype, "aiSummary", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String] }),
    __metadata("design:type", Array)
], MedicalRecord.prototype, "tags", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose_2.Schema.Types.ObjectId, ref: 'User' }] }),
    __metadata("design:type", Array)
], MedicalRecord.prototype, "sharedWith", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], MedicalRecord.prototype, "language", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], MedicalRecord.prototype, "translatedContent", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], MedicalRecord.prototype, "encryptionKeyId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], MedicalRecord.prototype, "isEncrypted", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], MedicalRecord.prototype, "facilityName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], MedicalRecord.prototype, "facilityId", void 0);
exports.MedicalRecord = MedicalRecord = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], MedicalRecord);
exports.MedicalRecordSchema = mongoose_1.SchemaFactory.createForClass(MedicalRecord);
exports.MedicalRecordSchema.index({ patientId: 1, recordDate: -1 });
exports.MedicalRecordSchema.index({ patientId: 1, type: 1 });
exports.MedicalRecordSchema.index({ doctorId: 1 });
exports.MedicalRecordSchema.index({ status: 1 });
//# sourceMappingURL=medical-record.schema.js.map
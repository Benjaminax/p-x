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
exports.AppointmentSchema = exports.Appointment = exports.Department = exports.AppointmentType = exports.AppointmentStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var AppointmentStatus;
(function (AppointmentStatus) {
    AppointmentStatus["SCHEDULED"] = "scheduled";
    AppointmentStatus["CONFIRMED"] = "confirmed";
    AppointmentStatus["IN_PROGRESS"] = "in_progress";
    AppointmentStatus["COMPLETED"] = "completed";
    AppointmentStatus["CANCELLED"] = "cancelled";
    AppointmentStatus["NO_SHOW"] = "no_show";
    AppointmentStatus["RESCHEDULED"] = "rescheduled";
})(AppointmentStatus || (exports.AppointmentStatus = AppointmentStatus = {}));
var AppointmentType;
(function (AppointmentType) {
    AppointmentType["IN_PERSON"] = "in_person";
    AppointmentType["TELEMEDICINE"] = "telemedicine";
    AppointmentType["PHONE"] = "phone";
    AppointmentType["EMERGENCY"] = "emergency";
    AppointmentType["FOLLOW_UP"] = "follow_up";
    AppointmentType["ROUTINE_CHECKUP"] = "routine_checkup";
})(AppointmentType || (exports.AppointmentType = AppointmentType = {}));
var Department;
(function (Department) {
    Department["CARDIOLOGY"] = "cardiology";
    Department["NEUROLOGY"] = "neurology";
    Department["ORTHOPEDICS"] = "orthopedics";
    Department["PEDIATRICS"] = "pediatrics";
    Department["GENERAL_PRACTICE"] = "general_practice";
    Department["DERMATOLOGY"] = "dermatology";
    Department["PSYCHIATRY"] = "psychiatry";
    Department["RADIOLOGY"] = "radiology";
    Department["EMERGENCY"] = "emergency";
})(Department || (exports.Department = Department = {}));
let Appointment = class Appointment extends mongoose_2.Document {
    patientId;
    doctorId;
    scheduledDate;
    scheduledTime;
    duration;
    status;
    type;
    department;
    reason;
    symptoms;
    attachedDocuments;
    hospitalName;
    roomNumber;
    address;
    meetingLink;
    meetingId;
    patientNotes;
    doctorNotes;
    isFollowUp;
    previousAppointmentId;
    nextAppointmentId;
    reminderSent;
    reminderDates;
    estimatedCost;
    currency;
    isPaid;
    cancellationReason;
    cancelledBy;
    cancelledAt;
};
exports.Appointment = Appointment;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Schema.Types.ObjectId)
], Appointment.prototype, "patientId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Schema.Types.ObjectId)
], Appointment.prototype, "doctorId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], Appointment.prototype, "scheduledDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Appointment.prototype, "scheduledTime", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Appointment.prototype, "duration", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: AppointmentStatus, default: AppointmentStatus.SCHEDULED }),
    __metadata("design:type", String)
], Appointment.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: AppointmentType, required: true }),
    __metadata("design:type", String)
], Appointment.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: Department }),
    __metadata("design:type", String)
], Appointment.prototype, "department", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Appointment.prototype, "reason", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Appointment.prototype, "symptoms", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String] }),
    __metadata("design:type", Array)
], Appointment.prototype, "attachedDocuments", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Appointment.prototype, "hospitalName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Appointment.prototype, "roomNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Appointment.prototype, "address", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Appointment.prototype, "meetingLink", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Appointment.prototype, "meetingId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Appointment.prototype, "patientNotes", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Appointment.prototype, "doctorNotes", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Boolean)
], Appointment.prototype, "isFollowUp", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Appointment' }),
    __metadata("design:type", mongoose_2.Schema.Types.ObjectId)
], Appointment.prototype, "previousAppointmentId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Appointment' }),
    __metadata("design:type", mongoose_2.Schema.Types.ObjectId)
], Appointment.prototype, "nextAppointmentId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Appointment.prototype, "reminderSent", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [Date] }),
    __metadata("design:type", Array)
], Appointment.prototype, "reminderDates", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Appointment.prototype, "estimatedCost", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Appointment.prototype, "currency", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Appointment.prototype, "isPaid", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Appointment.prototype, "cancellationReason", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Appointment.prototype, "cancelledBy", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Appointment.prototype, "cancelledAt", void 0);
exports.Appointment = Appointment = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Appointment);
exports.AppointmentSchema = mongoose_1.SchemaFactory.createForClass(Appointment);
exports.AppointmentSchema.index({ patientId: 1, scheduledDate: -1 });
exports.AppointmentSchema.index({ doctorId: 1, scheduledDate: -1 });
exports.AppointmentSchema.index({ status: 1 });
exports.AppointmentSchema.index({ scheduledDate: 1, status: 1 });
//# sourceMappingURL=appointment.schema.js.map
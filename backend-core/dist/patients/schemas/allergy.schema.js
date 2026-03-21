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
exports.AllergySchema = exports.Allergy = exports.AllergySeverity = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var AllergySeverity;
(function (AllergySeverity) {
    AllergySeverity["MILD"] = "mild";
    AllergySeverity["MODERATE"] = "moderate";
    AllergySeverity["SEVERE"] = "severe";
    AllergySeverity["LIFE_THREATENING"] = "life-threatening";
})(AllergySeverity || (exports.AllergySeverity = AllergySeverity = {}));
let Allergy = class Allergy extends mongoose_2.Document {
    patientId;
    allergen;
    reaction;
    severity;
    verifiedByLab;
    deletedAt;
};
exports.Allergy = Allergy;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'PatientProfile', required: true }),
    __metadata("design:type", mongoose_2.Schema.Types.ObjectId)
], Allergy.prototype, "patientId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Allergy.prototype, "allergen", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Allergy.prototype, "reaction", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: AllergySeverity, required: true }),
    __metadata("design:type", String)
], Allergy.prototype, "severity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Allergy.prototype, "verifiedByLab", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Allergy.prototype, "deletedAt", void 0);
exports.Allergy = Allergy = __decorate([
    (0, mongoose_1.Schema)({ timestamps: { createdAt: true, updatedAt: false } })
], Allergy);
exports.AllergySchema = mongoose_1.SchemaFactory.createForClass(Allergy);
exports.AllergySchema.index({ patientId: 1, createdAt: -1 });
exports.AllergySchema.index({ deletedAt: 1 });
//# sourceMappingURL=allergy.schema.js.map
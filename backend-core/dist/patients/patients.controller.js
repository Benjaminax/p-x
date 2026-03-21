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
exports.PatientsController = void 0;
const common_1 = require("@nestjs/common");
const guards_1 = require("../auth/guards");
const decorators_1 = require("../auth/decorators");
const user_schema_1 = require("../users/schemas/user.schema");
const create_allergy_dto_1 = require("./dto/create-allergy.dto");
const update_patient_profile_dto_1 = require("./dto/update-patient-profile.dto");
const patients_service_1 = require("./patients.service");
let PatientsController = class PatientsController {
    patientsService;
    constructor(patientsService) {
        this.patientsService = patientsService;
    }
    getProfile(req) {
        return this.patientsService.getOwnProfile(req.user.userId);
    }
    updateProfile(req, payload) {
        return this.patientsService.updateOwnProfile(req.user.userId, payload);
    }
    getOfflinePack(req) {
        return this.patientsService.getOfflinePack(req.user.userId);
    }
    getAllergies(req) {
        return this.patientsService.getOwnAllergies(req.user.userId);
    }
    addAllergy(req, payload) {
        return this.patientsService.addAllergy(req.user.userId, payload);
    }
    removeAllergy(req, id) {
        return this.patientsService.removeAllergy(req.user.userId, id);
    }
};
exports.PatientsController = PatientsController;
__decorate([
    (0, common_1.Get)('profile'),
    (0, decorators_1.Roles)(user_schema_1.UserRole.PATIENT),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PatientsController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Put)('profile'),
    (0, decorators_1.Roles)(user_schema_1.UserRole.PATIENT),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_patient_profile_dto_1.UpdatePatientProfileDto]),
    __metadata("design:returntype", void 0)
], PatientsController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Get)('profile/offline-pack'),
    (0, decorators_1.Roles)(user_schema_1.UserRole.PATIENT),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PatientsController.prototype, "getOfflinePack", null);
__decorate([
    (0, common_1.Get)('allergies'),
    (0, decorators_1.Roles)(user_schema_1.UserRole.PATIENT),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PatientsController.prototype, "getAllergies", null);
__decorate([
    (0, common_1.Post)('allergies'),
    (0, decorators_1.Roles)(user_schema_1.UserRole.PATIENT),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_allergy_dto_1.CreateAllergyDto]),
    __metadata("design:returntype", void 0)
], PatientsController.prototype, "addAllergy", null);
__decorate([
    (0, common_1.Delete)('allergies/:id'),
    (0, decorators_1.Roles)(user_schema_1.UserRole.PATIENT),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], PatientsController.prototype, "removeAllergy", null);
exports.PatientsController = PatientsController = __decorate([
    (0, common_1.Controller)('patients'),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    __metadata("design:paramtypes", [patients_service_1.PatientsService])
], PatientsController);
//# sourceMappingURL=patients.controller.js.map
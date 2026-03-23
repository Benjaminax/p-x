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
var AppService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const users_service_1 = require("./users/users.service");
const user_schema_1 = require("./users/schemas/user.schema");
let AppService = AppService_1 = class AppService {
    usersService;
    configService;
    logger = new common_1.Logger(AppService_1.name);
    constructor(usersService, configService) {
        this.usersService = usersService;
        this.configService = configService;
    }
    getHello() {
        return 'Hello World!';
    }
    async onModuleInit() {
        const nodeEnv = this.configService.get('NODE_ENV') || 'development';
        const enableDemoDoctor = (this.configService.get('ENABLE_DEMO_DOCTOR') || 'true').toLowerCase() !== 'false';
        if (nodeEnv === 'production' || !enableDemoDoctor) {
            return;
        }
        const demoDoctorEmail = this.configService.get('DEMO_DOCTOR_EMAIL') || 'doctor.demo@neurohealth.local';
        const demoDoctorPassword = this.configService.get('DEMO_DOCTOR_PASSWORD') || 'DoctorDemo123!';
        const demoDoctorName = this.configService.get('DEMO_DOCTOR_NAME') || 'Dr. Demo';
        const existingDoctor = await this.usersService.findOne(demoDoctorEmail);
        if (existingDoctor) {
            this.logger.log(`Demo doctor already present: ${demoDoctorEmail}`);
            return;
        }
        await this.usersService.create({
            email: demoDoctorEmail,
            password: demoDoctorPassword,
            fullName: demoDoctorName,
            role: user_schema_1.UserRole.DOCTOR,
        });
        this.logger.log(`Demo doctor created: ${demoDoctorEmail}`);
    }
};
exports.AppService = AppService;
exports.AppService = AppService = AppService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        config_1.ConfigService])
], AppService);
//# sourceMappingURL=app.service.js.map
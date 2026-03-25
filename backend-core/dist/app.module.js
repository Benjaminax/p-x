"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const Joi = __importStar(require("joi"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const logger_middleware_1 = require("./common/middleware/logger.middleware");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const medical_records_module_1 = require("./medical-records/medical-records.module");
const messaging_module_1 = require("./messaging/messaging.module");
const patients_module_1 = require("./patients/patients.module");
let mongoMemoryServer;
let AppModule = class AppModule {
    configure(consumer) {
        consumer
            .apply(logger_middleware_1.LoggerMiddleware)
            .forRoutes({ path: '(.*)', method: common_1.RequestMethod.ALL });
    }
    async onModuleDestroy() {
        if (mongoMemoryServer) {
            await mongoMemoryServer.stop();
        }
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: ['.env', '.env.example'],
                validationSchema: Joi.object({
                    NODE_ENV: Joi.string()
                        .valid('development', 'production', 'test')
                        .default('development'),
                    PORT: Joi.number().default(3001),
                    USE_MEMORY_DB: Joi.string().optional(),
                    MONGODB_URI: Joi.string().default('mongodb://localhost:27017/medical-records'),
                    JWT_SECRET: Joi.string().default('local-dev-jwt-secret'),
                    JWT_EXPIRATION: Joi.string().default('15m'),
                    JWT_REFRESH_SECRET: Joi.string().default('local-dev-jwt-refresh-secret'),
                    JWT_REFRESH_EXPIRATION: Joi.string().default('7d'),
                    ALLOW_ORIGINS: Joi.string().optional(),
                }),
            }),
            mongoose_1.MongooseModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: async (configService) => {
                    const useMemoryDb = configService.get('USE_MEMORY_DB') === 'true';
                    let uri;
                    if (useMemoryDb) {
                        mongoMemoryServer = await mongodb_memory_server_1.MongoMemoryServer.create();
                        uri = mongoMemoryServer.getUri();
                        console.log('Started in-memory MongoDB for local development');
                    }
                    else {
                        uri = configService.get('MONGODB_URI') || 'mongodb://localhost:27017/medical-records';
                    }
                    return { uri };
                },
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            medical_records_module_1.MedicalRecordsModule,
            messaging_module_1.MessagingModule,
            patients_module_1.PatientsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map
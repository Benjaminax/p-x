"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
let ApiExceptionFilter = class ApiExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception instanceof common_1.HttpException
            ? exception.getStatus()
            : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        const payload = this.resolvePayload(exception, status);
        response.status(status).json({
            ...payload,
            path: request.url,
        });
    }
    resolvePayload(exception, status) {
        if (exception instanceof common_1.HttpException) {
            const raw = exception.getResponse();
            if (typeof raw === 'string') {
                return {
                    error: true,
                    code: this.defaultCode(status),
                    message: raw,
                    timestamp: new Date().toISOString(),
                };
            }
            if (typeof raw === 'object' && raw !== null) {
                const candidate = raw;
                const message = Array.isArray(candidate.message)
                    ? candidate.message.join(', ')
                    : String(candidate.message ?? 'Request failed');
                return {
                    error: true,
                    code: String(candidate.code ?? this.defaultCode(status)),
                    message,
                    timestamp: new Date().toISOString(),
                };
            }
        }
        return {
            error: true,
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An unexpected error occurred. Please try again later.',
            timestamp: new Date().toISOString(),
        };
    }
    defaultCode(status) {
        switch (status) {
            case common_1.HttpStatus.BAD_REQUEST:
                return 'BAD_REQUEST';
            case common_1.HttpStatus.UNAUTHORIZED:
                return 'UNAUTHORIZED';
            case common_1.HttpStatus.FORBIDDEN:
                return 'FORBIDDEN';
            case common_1.HttpStatus.NOT_FOUND:
                return 'NOT_FOUND';
            case common_1.HttpStatus.CONFLICT:
                return 'CONFLICT';
            case common_1.HttpStatus.TOO_MANY_REQUESTS:
                return 'RATE_LIMIT_EXCEEDED';
            default:
                return 'REQUEST_FAILED';
        }
    }
};
exports.ApiExceptionFilter = ApiExceptionFilter;
exports.ApiExceptionFilter = ApiExceptionFilter = __decorate([
    (0, common_1.Catch)()
], ApiExceptionFilter);
//# sourceMappingURL=api-exception.filter.js.map
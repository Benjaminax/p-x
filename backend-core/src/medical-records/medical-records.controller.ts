import {
    Controller,
    Get,
    Post,
    Put,
    Body,
    Param,
    Query,
    UseGuards,
    Request,
    HttpCode,
    HttpStatus,
    ForbiddenException,
} from '@nestjs/common';
import { MedicalRecordsService } from './medical-records.service';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../auth/decorators';
import { UserRole } from '../users/schemas/user.schema';
import { 
    CreateMedicalRecordDto, 
    CreatePrescriptionDto, 
    CreateVitalSignsDto, 
    CreateAppointmentDto,
    CreateMedicalScanDto 
} from './dto';

@Controller('medical-records')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MedicalRecordsController {
    constructor(private readonly medicalRecordsService: MedicalRecordsService) {}

    // ============ Medical Records ============

    @Post()
    @Roles(UserRole.DOCTOR, UserRole.ADMIN)
    async createMedicalRecord(@Body() data: CreateMedicalRecordDto, @Request() req) {
        return this.medicalRecordsService.createMedicalRecord({
            ...data,
            doctorId: req.user.userId,
        } as any);
    }

    @Get('patient/:patientId')
    @Roles(UserRole.DOCTOR, UserRole.PATIENT, UserRole.ADMIN)
    async getMedicalRecords(
        @Param('patientId') patientId: string,
        @Request() req: any,
        @Query('type') type?: string,
        @Query('status') status?: string,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string
    ) {
        // Patients can only access their own records
        if (req.user.role === UserRole.PATIENT && req.user.userId !== patientId) {
            throw new ForbiddenException('Access denied');
        }

        return this.medicalRecordsService.getMedicalRecords(patientId, {
            type: type as any,
            status: status as any,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
        });
    }

    @Get(':recordId')
    @Roles(UserRole.DOCTOR, UserRole.PATIENT, UserRole.ADMIN)
    async getMedicalRecordById(@Param('recordId') recordId: string, @Request() req) {
        return this.medicalRecordsService.getMedicalRecordById(
            recordId,
            req.user.userId,
            req.user.role
        );
    }

    @Put(':recordId')
    @Roles(UserRole.DOCTOR, UserRole.ADMIN)
    async updateMedicalRecord(@Param('recordId') recordId: string, @Body() data: any) {
        return this.medicalRecordsService.updateMedicalRecord(recordId, data);
    }

    @Post(':recordId/share')
    @Roles(UserRole.PATIENT, UserRole.DOCTOR, UserRole.ADMIN)
    async shareMedicalRecord(@Param('recordId') recordId: string, @Body('userIds') userIds: string[]) {
        return this.medicalRecordsService.shareMedicalRecord(recordId, userIds);
    }

    // ============ Prescriptions ============

    @Post('prescriptions')
    @Roles(UserRole.DOCTOR, UserRole.ADMIN)
    async createPrescription(@Body() data: CreatePrescriptionDto, @Request() req) {
        return this.medicalRecordsService.createPrescription({
            ...data,
            doctorId: req.user.userId,
        } as any);
    }

    @Get('prescriptions/patient/:patientId')
    @Roles(UserRole.DOCTOR, UserRole.PATIENT, UserRole.ADMIN)
    async getPrescriptions(
        @Param('patientId') patientId: string,
        @Request() req: any,
        @Query('status') status?: string,
        @Query('active') active?: string
    ) {
        if (req.user.role === UserRole.PATIENT && req.user.userId !== patientId) {
            throw new ForbiddenException('Access denied');
        }

        return this.medicalRecordsService.getPrescriptions(patientId, {
            status: status as any,
            active: active === 'true',
        });
    }

    @Put('prescriptions/:prescriptionId/status')
    @Roles(UserRole.DOCTOR, UserRole.ADMIN)
    async updatePrescriptionStatus(
        @Param('prescriptionId') prescriptionId: string,
        @Body('status') status: string
    ) {
        return this.medicalRecordsService.updatePrescriptionStatus(prescriptionId, status as any);
    }

    @Put('prescriptions/:prescriptionId/adherence')
    @Roles(UserRole.PATIENT, UserRole.DOCTOR, UserRole.ADMIN)
    async updateMedicationAdherence(
        @Param('prescriptionId') prescriptionId: string,
        @Body('medicationName') medicationName: string,
        @Body('adherence') adherence: number
    ) {
        return this.medicalRecordsService.updateMedicationAdherence(
            prescriptionId,
            medicationName,
            adherence
        );
    }

    // ============ Vital Signs ============

    @Post('vitals')
    @Roles(UserRole.PATIENT, UserRole.DOCTOR, UserRole.NURSE, UserRole.ADMIN)
    async recordVitalSigns(@Body() data: CreateVitalSignsDto, @Request() req) {
        return this.medicalRecordsService.recordVitalSigns({
            ...data,
            recordedBy: req.user.userId,
        } as any);
    }

    @Get('vitals/patient/:patientId')
    @Roles(UserRole.DOCTOR, UserRole.PATIENT, UserRole.ADMIN)
    async getVitalSigns(
        @Param('patientId') patientId: string,
        @Request() req: any,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
        @Query('limit') limit?: string
    ) {
        if (req.user.role === UserRole.PATIENT && req.user.userId !== patientId) {
            throw new ForbiddenException('Access denied');
        }

        return this.medicalRecordsService.getVitalSigns(patientId, {
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
            limit: limit ? parseInt(limit) : undefined,
        });
    }

    @Get('vitals/patient/:patientId/latest')
    @Roles(UserRole.DOCTOR, UserRole.PATIENT, UserRole.ADMIN)
    async getLatestVitals(@Param('patientId') patientId: string, @Request() req: any) {
        if (req.user.role === UserRole.PATIENT && req.user.userId !== patientId) {
            throw new ForbiddenException('Access denied');
        }

        return this.medicalRecordsService.getLatestVitals(patientId);
    }

    // ============ Appointments ============

    @Post('appointments')
    @Roles(UserRole.PATIENT, UserRole.DOCTOR, UserRole.ADMIN)
    async createAppointment(@Body() data: CreateAppointmentDto, @Request() req) {
        return this.medicalRecordsService.createAppointment(data as any);
    }

    @Get('appointments')
    @Roles(UserRole.DOCTOR, UserRole.PATIENT, UserRole.ADMIN)
    async getAppointments(
        @Request() req: any,
        @Query('status') status?: string,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string
    ) {
        return this.medicalRecordsService.getAppointments(req.user.userId, req.user.role, {
            status: status as any,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
        });
    }

    @Put('appointments/:appointmentId/status')
    @Roles(UserRole.DOCTOR, UserRole.PATIENT, UserRole.ADMIN)
    async updateAppointmentStatus(
        @Param('appointmentId') appointmentId: string,
        @Body('status') status: string,
        @Body('notes') notes?: string
    ) {
        return this.medicalRecordsService.updateAppointmentStatus(appointmentId, status as any, notes);
    }

    @Put('appointments/:appointmentId/reschedule')
    @Roles(UserRole.PATIENT, UserRole.DOCTOR, UserRole.ADMIN)
    async rescheduleAppointment(
        @Param('appointmentId') appointmentId: string,
        @Body('newDate') newDate: string,
        @Body('newTime') newTime: string
    ) {
        return this.medicalRecordsService.rescheduleAppointment(
            appointmentId,
            new Date(newDate),
            newTime
        );
    }

    // ============ Medical Scans ============

    @Post('scans')
    @Roles(UserRole.DOCTOR, UserRole.ADMIN)
    async createMedicalScan(@Body() data: CreateMedicalScanDto, @Request() req) {
        return this.medicalRecordsService.createMedicalScan({
            ...data,
            orderingDoctorId: req.user.userId,
        } as any);
    }

    @Get('scans/patient/:patientId')
    @Roles(UserRole.DOCTOR, UserRole.PATIENT, UserRole.ADMIN)
    async getMedicalScans(
        @Param('patientId') patientId: string,
        @Request() req: any,
        @Query('scanType') scanType?: string,
        @Query('status') status?: string
    ) {
        if (req.user.role === UserRole.PATIENT && req.user.userId !== patientId) {
            throw new ForbiddenException('Access denied');
        }

        return this.medicalRecordsService.getMedicalScans(patientId, {
            scanType: scanType as any,
            status: status as any,
        });
    }

    @Put('scans/:scanId/report')
    @Roles(UserRole.DOCTOR, UserRole.ADMIN)
    async updateScanReport(@Param('scanId') scanId: string, @Body() report: any) {
        return this.medicalRecordsService.updateScanReport(scanId, report);
    }

    @Put('scans/:scanId/ai-analysis')
    @Roles(UserRole.DOCTOR, UserRole.ADMIN)
    async addAiAnalysisToScan(@Param('scanId') scanId: string, @Body() analysis: any) {
        return this.medicalRecordsService.addAiAnalysisToScan(scanId, analysis);
    }

    // ============ Health Summary ============

    @Get('summary/patient/:patientId')
    @Roles(UserRole.DOCTOR, UserRole.PATIENT, UserRole.ADMIN)
    async getPatientHealthSummary(@Param('patientId') patientId: string, @Request() req: any) {
        if (req.user.role === UserRole.PATIENT && req.user.userId !== patientId) {
            throw new ForbiddenException('Access denied');
        }

        return this.medicalRecordsService.getPatientHealthSummary(patientId);
    }
}

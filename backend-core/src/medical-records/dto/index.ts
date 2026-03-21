import { IsString, IsNotEmpty, IsEnum, IsOptional, IsDate, IsArray, IsBoolean, IsObject, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { RecordType, RecordStatus } from '../schemas/medical-record.schema';

export class CreateMedicalRecordDto {
    @IsString()
    @IsNotEmpty()
    patientId!: string;

    @IsString()
    @IsNotEmpty()
    title!: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsEnum(RecordType)
    type!: RecordType;

    @IsEnum(RecordStatus)
    @IsOptional()
    status?: RecordStatus;

    @IsDate()
    @Type(() => Date)
    recordDate!: Date;

    @IsObject()
    @IsOptional()
    structuredData?: any;

    @IsArray()
    @IsOptional()
    attachmentUrls?: string[];

    @IsArray()
    @IsOptional()
    tags?: string[];

    @IsString()
    @IsOptional()
    facilityName?: string;
}

export class CreatePrescriptionDto {
    @IsString()
    @IsNotEmpty()
    patientId!: string;

    @IsArray()
    @IsNotEmpty()
    medications!: any[];

    @IsDate()
    @Type(() => Date)
    prescriptionDate!: Date;

    @IsString()
    @IsOptional()
    notes?: string;

    @IsString()
    @IsOptional()
    diagnosis?: string;
}

export class CreateVitalSignsDto {
    @IsString()
    @IsNotEmpty()
    patientId!: string;

    @IsDate()
    @Type(() => Date)
    recordedAt!: Date;

    @IsObject()
    @IsOptional()
    bloodPressure?: { systolic: number; diastolic: number };

    @IsNumber()
    @IsOptional()
    heartRate?: number;

    @IsNumber()
    @IsOptional()
    temperature?: number;

    @IsNumber()
    @IsOptional()
    oxygenSaturation?: number;

    @IsNumber()
    @IsOptional()
    weight?: number;

    @IsNumber()
    @IsOptional()
    height?: number;

    @IsString()
    @IsOptional()
    notes?: string;
}

export class CreateAppointmentDto {
    @IsString()
    @IsNotEmpty()
    patientId!: string;

    @IsString()
    @IsNotEmpty()
    doctorId!: string;

    @IsDate()
    @Type(() => Date)
    scheduledDate!: Date;

    @IsString()
    @IsNotEmpty()
    scheduledTime!: string;

    @IsString()
    @IsNotEmpty()
    type!: string;

    @IsString()
    @IsNotEmpty()
    reason!: string;

    @IsString()
    @IsOptional()
    symptoms?: string;
}

export class CreateMedicalScanDto {
    @IsString()
    @IsNotEmpty()
    patientId!: string;

    @IsDate()
    @Type(() => Date)
    scanDate!: Date;

    @IsString()
    @IsNotEmpty()
    scanType!: string;

    @IsString()
    @IsNotEmpty()
    bodyPart!: string;

    @IsArray()
    @IsNotEmpty()
    imageUrls!: string[];

    @IsString()
    @IsOptional()
    clinicalHistory?: string;
}

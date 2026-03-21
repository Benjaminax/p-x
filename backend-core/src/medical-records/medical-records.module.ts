import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MedicalRecordsController } from './medical-records.controller';
import { MedicalRecordsService } from './medical-records.service';
import { MedicalRecord, MedicalRecordSchema } from './schemas/medical-record.schema';
import { Prescription, PrescriptionSchema } from './schemas/prescription.schema';
import { VitalSigns, VitalSignsSchema } from './schemas/vital-signs.schema';
import { Appointment, AppointmentSchema } from './schemas/appointment.schema';
import { MedicalScan, MedicalScanSchema } from './schemas/medical-scan.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: MedicalRecord.name, schema: MedicalRecordSchema },
            { name: Prescription.name, schema: PrescriptionSchema },
            { name: VitalSigns.name, schema: VitalSignsSchema },
            { name: Appointment.name, schema: AppointmentSchema },
            { name: MedicalScan.name, schema: MedicalScanSchema },
        ]),
        AuthModule,
    ],
    controllers: [MedicalRecordsController],
    providers: [MedicalRecordsService],
    exports: [MedicalRecordsService],
})
export class MedicalRecordsModule {}

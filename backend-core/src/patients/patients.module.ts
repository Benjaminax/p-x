import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PatientsController } from './patients.controller';
import { PatientsService } from './patients.service';
import { Allergy, AllergySchema } from './schemas/allergy.schema';
import {
  PatientProfile,
  PatientProfileSchema,
} from './schemas/patient-profile.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PatientProfile.name, schema: PatientProfileSchema },
      { name: Allergy.name, schema: AllergySchema },
    ]),
  ],
  controllers: [PatientsController],
  providers: [PatientsService],
  exports: [PatientsService],
})
export class PatientsModule {}

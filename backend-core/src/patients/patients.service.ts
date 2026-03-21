import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserRole } from '../users/schemas/user.schema';
import { CreateAllergyDto } from './dto/create-allergy.dto';
import { UpdatePatientProfileDto } from './dto/update-patient-profile.dto';
import { Allergy } from './schemas/allergy.schema';
import { PatientProfile } from './schemas/patient-profile.schema';

@Injectable()
export class PatientsService {
  constructor(
    @InjectModel(PatientProfile.name)
    private readonly patientProfileModel: Model<PatientProfile>,
    @InjectModel(Allergy.name)
    private readonly allergyModel: Model<Allergy>,
  ) {}

  async getOwnProfile(userId: string): Promise<PatientProfile> {
    const patient = await this.findPatientByUserId(userId);
    if (!patient) {
      throw new NotFoundException('Patient profile not found');
    }
    return patient;
  }

  async updateOwnProfile(userId: string, payload: UpdatePatientProfileDto): Promise<PatientProfile> {
    const patient = await this.findPatientByUserId(userId);
    if (!patient) {
      throw new NotFoundException('Patient profile not found');
    }

    if (payload.dateOfBirth) {
      (payload as any).dateOfBirth = new Date(payload.dateOfBirth);
    }

    await this.patientProfileModel.findByIdAndUpdate(patient._id, payload).exec();
    const updated = await this.patientProfileModel.findById(patient._id).exec();
    if (!updated) {
      throw new NotFoundException('Patient profile not found');
    }

    return updated;
  }

  async getOfflinePack(userId: string) {
    const profile = await this.getOwnProfile(userId);
    const allergies = await this.allergyModel
      .find({ patientId: profile._id, deletedAt: { $exists: false } } as any)
      .sort({ createdAt: -1 })
      .exec();

    return {
      profile,
      allergies,
      bloodType: profile.bloodType || null,
      genotype: profile.genotype || null,
      currentMedications: [],
      activePrescriptions: [],
      emergencyContact: {
        name: profile.emergencyContactName || null,
        phone: profile.emergencyContactPhone || null,
      },
      medicalRecords: [],
      insuranceCard: {
        provider: profile.healthInsuranceProvider || null,
        number: profile.healthInsuranceNumber || null,
        cardUrl: profile.insuranceCardUrl || null,
      },
      lastSynced: new Date().toISOString(),
    };
  }

  async getOwnAllergies(userId: string): Promise<Allergy[]> {
    const patient = await this.findPatientByUserId(userId);
    if (!patient) {
      throw new NotFoundException('Patient profile not found');
    }

    return this.allergyModel
      .find({ patientId: patient._id, deletedAt: { $exists: false } } as any)
      .sort({ createdAt: -1 })
      .exec();
  }

  async addAllergy(userId: string, payload: CreateAllergyDto): Promise<Allergy> {
    const patient = await this.findPatientByUserId(userId);
    if (!patient) {
      throw new NotFoundException('Patient profile not found');
    }

    const allergy = new this.allergyModel({
      ...payload,
      patientId: patient._id,
      verifiedByLab: payload.verifiedByLab ?? false,
    });

    return allergy.save();
  }

  async removeAllergy(userId: string, allergyId: string): Promise<{ success: true }> {
    const patient = await this.findPatientByUserId(userId);
    if (!patient) {
      throw new NotFoundException('Patient profile not found');
    }

    if (!Types.ObjectId.isValid(allergyId)) {
      throw new BadRequestException('Invalid allergy id');
    }

    const allergy = await this.allergyModel.findById(allergyId).exec();
    if (!allergy || allergy.deletedAt) {
      throw new NotFoundException('Allergy not found');
    }

    if (String(allergy.patientId) !== String(patient._id)) {
      throw new ForbiddenException('Access denied');
    }

    allergy.deletedAt = new Date();
    await allergy.save();
    return { success: true };
  }

  assertPatientRole(role: UserRole) {
    if (role !== UserRole.PATIENT) {
      throw new ForbiddenException('Patient access required');
    }
  }

  private async findPatientByUserId(userId: string): Promise<PatientProfile | null> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user id');
    }

    return this.patientProfileModel.findOne({
      userId: new Types.ObjectId(userId),
      deletedAt: { $exists: false },
    } as any).exec();
  }
}

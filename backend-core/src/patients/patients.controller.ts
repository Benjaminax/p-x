import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../auth/decorators';
import { UserRole } from '../users/schemas/user.schema';
import { CreateAllergyDto } from './dto/create-allergy.dto';
import { UpdatePatientProfileDto } from './dto/update-patient-profile.dto';
import { PatientsService } from './patients.service';

@Controller('patients')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Get('profile')
  @Roles(UserRole.PATIENT)
  getProfile(@Req() req: Request & { user: any }) {
    return this.patientsService.getOwnProfile(req.user.userId);
  }

  @Put('profile')
  @Roles(UserRole.PATIENT)
  updateProfile(
    @Req() req: Request & { user: any },
    @Body() payload: UpdatePatientProfileDto,
  ) {
    return this.patientsService.updateOwnProfile(req.user.userId, payload);
  }

  @Get('profile/offline-pack')
  @Roles(UserRole.PATIENT)
  getOfflinePack(@Req() req: Request & { user: any }) {
    return this.patientsService.getOfflinePack(req.user.userId);
  }

  @Get('allergies')
  @Roles(UserRole.PATIENT)
  getAllergies(@Req() req: Request & { user: any }) {
    return this.patientsService.getOwnAllergies(req.user.userId);
  }

  @Post('allergies')
  @Roles(UserRole.PATIENT)
  addAllergy(@Req() req: Request & { user: any }, @Body() payload: CreateAllergyDto) {
    return this.patientsService.addAllergy(req.user.userId, payload);
  }

  @Delete('allergies/:id')
  @Roles(UserRole.PATIENT)
  removeAllergy(@Req() req: Request & { user: any }, @Param('id') id: string) {
    return this.patientsService.removeAllergy(req.user.userId, id);
  }
}

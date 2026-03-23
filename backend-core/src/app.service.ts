import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from './users/users.service';
import { UserRole } from './users/schemas/user.schema';

@Injectable()
export class AppService implements OnModuleInit {
  private readonly logger = new Logger(AppService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async onModuleInit(): Promise<void> {
    const nodeEnv = this.configService.get<string>('NODE_ENV') || 'development';
    const enableDemoDoctor =
      (this.configService.get<string>('ENABLE_DEMO_DOCTOR') || 'true').toLowerCase() !== 'false';

    // Keep this account in non-production only for local demos.
    if (nodeEnv === 'production' || !enableDemoDoctor) {
      return;
    }

    const demoDoctorEmail =
      this.configService.get<string>('DEMO_DOCTOR_EMAIL') || 'doctor.demo@neurohealth.local';
    const demoDoctorPassword =
      this.configService.get<string>('DEMO_DOCTOR_PASSWORD') || 'DoctorDemo123!';
    const demoDoctorName =
      this.configService.get<string>('DEMO_DOCTOR_NAME') || 'Dr. Demo';

    const existingDoctor = await this.usersService.findOne(demoDoctorEmail);
    if (existingDoctor) {
      this.logger.log(`Demo doctor already present: ${demoDoctorEmail}`);
      return;
    }

    await this.usersService.create({
      email: demoDoctorEmail,
      password: demoDoctorPassword,
      fullName: demoDoctorName,
      role: UserRole.DOCTOR,
    });

    this.logger.log(`Demo doctor created: ${demoDoctorEmail}`);
  }
}

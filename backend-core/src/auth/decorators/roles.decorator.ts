import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../users/schemas/user.schema';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
export const RequiresRole = (...roles: UserRole[]) => Roles(...roles);

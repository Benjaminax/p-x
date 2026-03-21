import { UserRole } from '../../users/schemas/user.schema';
export declare const Roles: (...roles: UserRole[]) => import("@nestjs/common").CustomDecorator<string>;
export declare const RequiresRole: (...roles: UserRole[]) => import("@nestjs/common").CustomDecorator<string>;

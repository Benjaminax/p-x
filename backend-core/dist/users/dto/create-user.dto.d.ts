import { UserRole } from '../schemas/user.schema';
export declare class CreateUserDto {
    email: string;
    password: string;
    fullName: string;
    role?: UserRole;
    nhiNumber?: string;
    phoneNumber?: string;
}

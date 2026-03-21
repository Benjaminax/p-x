import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    private static readonly REFRESH_COOKIE;
    private setRefreshCookie;
    private clearRefreshCookie;
    register(createUserDto: CreateUserDto, res: Response): Promise<any>;
    login(req: Request & {
        user: any;
    }, res: Response): Promise<any>;
    getMe(req: Request & {
        user: any;
    }): any;
    getProfile(req: Request & {
        user: any;
    }): any;
    refresh(req: Request, res: Response): Promise<any>;
    logout(req: Request & {
        user: any;
    }, res: Response): Promise<any>;
}

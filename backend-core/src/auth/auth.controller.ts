import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LocalAuthGuard, JwtAuthGuard } from './guards';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    private static readonly REFRESH_COOKIE = 'projectx_refresh_token';

    private setRefreshCookie(res: Response, refreshToken: string) {
        res.cookie(AuthController.REFRESH_COOKIE, refreshToken, {
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/api/v1/auth',
        });
    }

    private clearRefreshCookie(res: Response) {
        res.clearCookie(AuthController.REFRESH_COOKIE, {
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            path: '/api/v1/auth',
        });
    }

    @Post('register')
    async register(@Body() createUserDto: CreateUserDto, @Res({ passthrough: true }) res: Response): Promise<any> {
        const auth = await this.authService.register(createUserDto);
        this.setRefreshCookie(res, auth.refresh_token);
        return {
            access_token: auth.access_token,
            user: auth.user,
        };
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Req() req: Request & { user: any }, @Res({ passthrough: true }) res: Response): Promise<any> {
        const auth = await this.authService.login(req.user);
        this.setRefreshCookie(res, auth.refresh_token);
        return {
            access_token: auth.access_token,
            user: auth.user,
        };
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    getMe(@Req() req: Request & { user: any }) {
        return req.user;
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Req() req: Request & { user: any }) {
        return req.user;
    }

    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<any> {
        const token = req.cookies?.[AuthController.REFRESH_COOKIE];
        const refreshed = await this.authService.refresh(token);
        this.setRefreshCookie(res, refreshed.refresh_token);

        return {
            access_token: refreshed.access_token,
            user: refreshed.user,
        };
    }

    @UseGuards(JwtAuthGuard)
    @Post('logout')
    @HttpCode(HttpStatus.OK)
    async logout(@Req() req: Request & { user: any }, @Res({ passthrough: true }) res: Response): Promise<any> {
        await this.authService.logout(req.user.userId);
        this.clearRefreshCookie(res);
        return { success: true };
    }
}

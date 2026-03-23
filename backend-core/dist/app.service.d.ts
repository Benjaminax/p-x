import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from './users/users.service';
export declare class AppService implements OnModuleInit {
    private readonly usersService;
    private readonly configService;
    private readonly logger;
    constructor(usersService: UsersService, configService: ConfigService);
    getHello(): string;
    onModuleInit(): Promise<void>;
}

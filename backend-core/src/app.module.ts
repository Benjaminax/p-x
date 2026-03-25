import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as Joi from 'joi';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MedicalRecordsModule } from './medical-records/medical-records.module';
import { MessagingModule } from './messaging/messaging.module';
import { PatientsModule } from './patients/patients.module';

let mongoMemoryServer: MongoMemoryServer;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // Allow fresh clones to boot from committed defaults in .env.example.
      envFilePath: ['.env', '.env.example'],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        PORT: Joi.number().default(3001),
        USE_MEMORY_DB: Joi.string().optional(),
        MONGODB_URI: Joi.string().default('mongodb://localhost:27017/medical-records'),
        JWT_SECRET: Joi.string().default('local-dev-jwt-secret'),
        JWT_EXPIRATION: Joi.string().default('15m'),
        JWT_REFRESH_SECRET: Joi.string().default('local-dev-jwt-refresh-secret'),
        JWT_REFRESH_EXPIRATION: Joi.string().default('7d'),
        ALLOW_ORIGINS: Joi.string().optional(),
      }),
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const useMemoryDb = configService.get<string>('USE_MEMORY_DB') === 'true';

        let uri: string;
        if (useMemoryDb) {
          mongoMemoryServer = await MongoMemoryServer.create();
          uri = mongoMemoryServer.getUri();
          console.log('Started in-memory MongoDB for local development');
        } else {
          uri = configService.get<string>('MONGODB_URI') || 'mongodb://localhost:27017/medical-records';
        }

        return { uri };
      },
    }),
    AuthModule,
    UsersModule,
    MedicalRecordsModule,
    MessagingModule,
    PatientsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      // Use a named wildcard to satisfy path-to-regexp v7
      .forRoutes({ path: '(.*)', method: RequestMethod.ALL });
  }

  async onModuleDestroy() {
    if (mongoMemoryServer) {
      await mongoMemoryServer.stop();
    }
  }
}

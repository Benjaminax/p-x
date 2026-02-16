import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    private logger = new Logger('HTTP');

    use(req: Request, res: Response, next: NextFunction): void {
        const { ip, method, baseUrl } = req;
        const userAgent = req.get('user-agent') || '';

        // Generate or retrieve Correlation ID
        const correlationId = req.get('x-correlation-id') || uuidv4();
        req.headers['x-correlation-id'] = correlationId;
        res.setHeader('x-correlation-id', correlationId);

        const start = Date.now();

        res.on('finish', () => {
            const { statusCode } = res;
            const contentLength = res.get('content-length');
            const duration = Date.now() - start;

            this.logger.log(
                `[${correlationId}] ${method} ${baseUrl} ${statusCode} ${contentLength}b - ${duration}ms - ${userAgent} ${ip}`,
            );
        });

        next();
    }
}

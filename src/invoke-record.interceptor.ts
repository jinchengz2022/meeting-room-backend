import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { Observable, tap } from 'rxjs';

@Injectable()
export class InvokeRecordInterceptor implements NestInterceptor {
  private readonly logger = new Logger(InvokeRecordInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    const { ip, path, method } = request;
    const userAgent = request.headers['user-agent'];

    this.logger.debug(
      `${ip} ${path} ${method} ${userAgent}: ${context.getClass().name} ${context.getHandler().name} invoke...`,
    );

    this.logger.debug(`user: ${request?.user?.userId} ${request?.user?.username}`);
    
    const now = Date.now();

    return next.handle().pipe(
      tap((res) => {
        this.logger.debug(
          `${ip} ${path} ${method} ${userAgent}: ${response.statusCode}: ${Date.now() - now}ms`,
        );
        this.logger.debug(`Response: ${JSON.stringify(res)}`);
      }),
    );
  }
}

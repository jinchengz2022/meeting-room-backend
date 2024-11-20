import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
export declare class UnLoginException {
    message: string;
    constructor(message?: any);
}
export declare class UnloginFilter implements ExceptionFilter {
    catch(exception: UnLoginException, host: ArgumentsHost): void;
}

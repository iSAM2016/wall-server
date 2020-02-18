import { ExceptionFilter, ArgumentsHost, HttpException } from '@nestjs/common';
interface ResponseIterface {
    statusCode: number;
    timestamp: string;
    message?: string;
    path?: string;
}
export declare class HttpExceptionFilter implements ExceptionFilter {
    private response;
    private request;
    private status;
    private errorResponse;
    catch(exception: HttpException, host: ArgumentsHost): void;
    getMregeresponseMessage(): ResponseIterface;
}
export {};

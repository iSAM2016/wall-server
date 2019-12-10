import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

interface ResponseIterface {
  statusCode: number;
  timestamp: string;
  message?: string;
  path?: string;
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse<Response>();
    const request: Request = ctx.getRequest<Request>();
    const status: number = exception.getStatus();
    const errorResponse = exception.getResponse();
    const responseMessage: ResponseIterface = {
      statusCode: status,
      timestamp: new Date().getTime().toString(),
    };
    switch (status) {
      case HttpStatus.UNAUTHORIZED: // 如果错误码 401 就需要退出了
        response.status(status).json({
          ...{
            message: '非法用户',
            path: '/login',
          },
          ...responseMessage,
        });
        // response.redirect('/login');
        break;

      default:
        response.status(status).json({
          ...{
            message: (errorResponse as any).message,
            path: request.url,
          },
          ...responseMessage,
        });
        break;
    }
  }
}

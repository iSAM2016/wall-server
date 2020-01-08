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
  private response: Response;
  private request: Request;
  private status: number;
  private errorResponse;

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    this.status = exception.getStatus();
    this.response = ctx.getResponse<Response>();
    this.request = ctx.getRequest<Request>();
    this.errorResponse = exception.getResponse();
    this.response.status(this.status).json(this.getMregeresponseMessage());
  }
  /**
   * 得到返回信息
   * @param status
   */
  getMregeresponseMessage(): ResponseIterface {
    let responseMessage: ResponseIterface = {
      statusCode: this.status,
      timestamp: new Date().getTime().toString(),
    };
    switch (this.status) {
      case HttpStatus.UNAUTHORIZED: // 如果错误码 401 就需要退出了
        return {
          ...{
            message: '非法用户',
            path: '/login',
          },
          ...responseMessage,
        };
        // response.redirect('/login');
        break;
      case HttpStatus.BAD_REQUEST:
        return {
          ...{
            message: (this.errorResponse as any).message,
            path: this.request.url,
          },
          ...responseMessage,
        };
      default:
        return {
          ...{
            message: (this.errorResponse as any).message,
            path: this.request.url,
          },
          ...responseMessage,
        };
        break;
    }
  }
}

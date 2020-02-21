import * as winston from 'winston';
import { Logger } from '@nestjs/common';

export class LoggerService extends Logger {
  error(message: string, trace: string) {
    // add your tailored logic here
    super.error(message, trace);
  }

  log(message: string, trace: string) {
    super.error(message, trace);
  }
  warn(message: string, trace: string) {
    super.error(message, trace);
  }
  debug(message: string, trace: string) {
    super.error(message, trace);
  }
  verbose(message: string, trace: string) {
    super.error(message, trace);
  }
}

class LoggerServices {
  private readonly instance: winston.Logger;

  public constructor() {
    const format = this.isProductionEnv()
      ? winston.format.combine(
          winston.format.timestamp(),
          winston.format.json(),
        )
      : winston.format.combine(
          winston.format.colorize(),
          winston.format.simple(),
        );

    this.instance = winston.createLogger({
      level: 'info',
      silent: this.isTestEnv(),
      format,
      transports: [
        new winston.transports.Console({
          stderrLevels: ['error'],
        }),
      ],
    });
  }

  public info(message: string) {
    this.instance.info(message);
  }

  public error(message: string) {
    this.instance.error(message);
  }

  private isTestEnv(): boolean {
    return process.env.NODE_ENV === 'test';
  }

  private isProductionEnv(): boolean {
    return (
      process.env.NODE_ENV === 'production' ||
      process.env.NODE_ENV === 'staging'
    );
  }
}

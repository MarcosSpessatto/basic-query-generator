import {
  Handler,
  NextFunction,
  Request,
  Response,
} from 'express';

import { ILogger } from '@common/ILogger';

export function log(method: string, url: string, status: number, startDate: Date, logger: ILogger = console): void {
  const ms = new Date().getTime() - startDate.getTime();
  const msg = `${method} ${url} ${status} ${ms}ms`;
  if (status >= 500) {
    logger.error(msg);
  } else if (status >= 400) {
    logger.warn(msg);
  } else if (status >= 100) {
    logger.info(msg);
  }
}

export function loggerMiddleware(logger: ILogger = console): Handler {
  return (request: Request, response: Response, next: NextFunction): void => {
    const start = new Date();

    if (response.headersSent) {
      log(request.method, request.url, response.statusCode, start, logger);
    } else {
      response.on('finish', () => log(request.method, request.url, response.statusCode, start, logger));
    }
    next();
  };
}

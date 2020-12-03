import { NextFunction, Request, Response } from 'express';

import { ILogger } from '@common/ILogger';
import { IHttpException } from '@common/exceptions/http/IHttpException';
import { InternalException } from '@common/exceptions/http/InternalException';

export function errorMiddleware(logger: ILogger = console) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return (error: IHttpException, request: Request, response: Response, next: NextFunction): void => {
    let responseError = error;

    if (!error.status) {
      logger.error(error.message);
      responseError = new InternalException();
    }
    const { message } = responseError;
    response.status(responseError.status).send({ message });
  };
}

import { IHttpException } from '@common/exceptions/http/IHttpException';

export class InternalException extends Error implements IHttpException {
  public readonly status = 500;
  public readonly message = 'Internal Error';
}

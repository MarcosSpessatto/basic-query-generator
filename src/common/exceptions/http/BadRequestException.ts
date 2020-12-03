import { IHttpException } from '@common/exceptions/http/IHttpException';

export class BadRequestException extends Error implements IHttpException {
    public readonly status = 400;
    public message: string;

    constructor(message: string) {
      super();
      this.message = message;
    }
}

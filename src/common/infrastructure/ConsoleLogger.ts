import { ILogger } from '@common/ILogger';
import { singleton } from 'tsyringe';

@singleton()
export class ConsoleLogger implements ILogger {
  public error(message?: Error, ...optionalParams: any[]): void {
    // eslint-disable-next-line no-console
    console.error(message, ...optionalParams);
  }

  public info(message?: string, ...optionalParams: any[]): void {
    // eslint-disable-next-line no-console
    console.info(message, ...optionalParams);
  }

  public warn(message?: string, ...optionalParams: any[]): void {
    // eslint-disable-next-line no-console
    console.warn(message, ...optionalParams);
  }
}

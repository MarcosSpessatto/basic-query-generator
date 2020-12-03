import { inject, injectable } from 'tsyringe';

import { AppConfig } from '@common/infrastructure/AppConfig';
import { IRestService } from '@common/infrastructure/rest/IRestService';
import { HttpServer } from '@common/infrastructure/HttpServer';
import { ILogger } from '@common/ILogger';

@injectable()
export class App {
  constructor(
    @inject('AppConfig') private appConfig: AppConfig,
    @inject('RestService') private restService: IRestService,
    @inject('HttpServer') private httpServer: HttpServer,
    @inject('Logger') private logger: ILogger,
  ) { }

  public async start(baseDir: string): Promise<void> {
    try {
      const config = this.appConfig.setup({ baseDir });
      const restHandler = await this.restService.setup(config.baseDir, config.origin, ['query-generator']);
      await this.httpServer.start(config.port, restHandler);
    } catch (err) {
      this.logger.error(err.message);
      process.exit(1);
    }
  }
}

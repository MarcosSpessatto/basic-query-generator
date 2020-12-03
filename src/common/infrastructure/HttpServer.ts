import http, { IncomingMessage, Server, ServerResponse } from 'http';
import { inject, injectable } from 'tsyringe';

import { ILogger } from '@common/ILogger';

@injectable()
export class HttpServer {
  constructor(@inject('Logger') private logger: ILogger) {}

  public async start(port: number, callback: (req: IncomingMessage, res: ServerResponse) => void): Promise<Server> {
    return new Promise((resolve, reject) => {
      const server = http.createServer(callback);
      server.listen(port);
      server.on('error', (err) => {
        reject(err);
      });
      server.on('listening', () => {
        this.logger.info(`Application listening on port ${port}`);
        resolve(server);
      });
      return server;
    });
  }
}

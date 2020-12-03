import cors from 'cors';
import helmet from 'helmet';
import { IncomingMessage, ServerResponse } from 'http';
import { join as pathJoin } from 'path';
import { injectable, inject } from 'tsyringe';
import express, {
  Handler,
  NextFunction,
  Request,
  Response,
} from 'express';

import { loadModules } from '@common/infrastructure/fileSystem';
import { IRestService } from '@common/infrastructure/rest/IRestService';
import { IHttpApiDefinition } from '@common/IHttpApiDefinition';
import { ILogger } from '@common/ILogger';

import { errorMiddleware } from '@common/infrastructure/rest/middlewares/errorMiddleware';
import { loggerMiddleware } from '@common/infrastructure/rest/middlewares/loggerMiddleware';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJson = require('../../../../package.json');

@injectable()
export class ExpressRestService implements IRestService {
  private readonly app = express();

  constructor(@inject('Logger') private logger: ILogger) {}

  public async setup(baseDir: string, origin: string, moduleNames: string[]): Promise<(req: IncomingMessage, res: ServerResponse) => void> {
    this.app.use(loggerMiddleware(this.logger));

    this.app.use(cors({ origin }));
    this.app.use(helmet());
    this.app.get('/version', (req: Request, res: Response) => res.send(packageJson.version));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    await this.setRoutes(baseDir, moduleNames);
    this.app.use(errorMiddleware(this.logger));
    return this.app;
  }

  private async setRoutes(baseDir: string, moduleNames: string[]): Promise<void> {
    const loadPromises = moduleNames.map((moduleName) => loadModules(pathJoin(baseDir, moduleName, 'resources', 'rest')));
    const modules = await Promise.all(loadPromises);
    const routeFiles = modules.flat();

    const routeLists = routeFiles.map((module: any): IHttpApiDefinition[] => {
      if (!module?.routes) {
        throw new Error('Files in resources/rest needs to export a routes object');
      }
      return module.routes;
    });
    const routes = routeLists.flat();

    routes.forEach((routeDefinition: IHttpApiDefinition) => this.setRoute(routeDefinition));
  }

  private setRoute(routeDefinition: IHttpApiDefinition): void {
    const { method } = routeDefinition;
    const wrappedHandler = this.wrapHandler(routeDefinition.handler);
    const handlers = [];
    handlers.push(wrappedHandler);
    this.app[method](routeDefinition.path, handlers);
  }

  private wrapHandler(handler: Handler) {
    return async (request: Request, response: Response, next: NextFunction): Promise<void> => {
      try {
        const result = await handler(request, response, next);
        response.json(result);
      } catch (err) {
        next(err);
      }
    };
  }
}

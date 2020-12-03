import { container } from 'tsyringe';

import { AppConfig } from '@common/infrastructure/AppConfig';
import { HttpServer } from '@common/infrastructure/HttpServer';
import { ExpressRestService } from '@common/infrastructure/rest/ExpressRestService';
import { ConsoleLogger } from '@common/infrastructure/ConsoleLogger';
import {
  DocumentBasedQueryGeneratorService,
} from '@query-generator/application/document-based/QueryGeneratorService';
import { MongoDBQueryGenerator } from '@query-generator/helpers/persistence/dbms-query-generator/document-based/mongodb/QueryGenerator';

container.register('AppConfig', { useClass: AppConfig });
container.register('HttpServer', { useClass: HttpServer });
container.register('RestService', { useClass: ExpressRestService });
container.register('Logger', { useClass: ConsoleLogger });

container.register('DocumentBasedQueryGeneratorService', { useClass: DocumentBasedQueryGeneratorService });
container.register('DocumentBasedQueryGenerator', { useClass: MongoDBQueryGenerator });

export const DomainRegistry = container;

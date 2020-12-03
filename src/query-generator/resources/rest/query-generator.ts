import { IHttpApiDefinition } from '@common/IHttpApiDefinition';
import { Request } from 'express';
import { DomainRegistry } from '@common/infrastructure/container';
import { BadRequestException } from '@common/exceptions/http/BadRequestException';
import { DocumentBasedQueryGeneratorService } from '@query-generator/application/document-based/QueryGeneratorService';

const generateUpdateStatement = async (request: Request): Promise<any> => {
  const { document, mutation } = request.body;
  if (!document) {
    throw new BadRequestException('"document" is required.');
  }
  if (!mutation) {
    throw new BadRequestException('"mutation" is required.');
  }
  const documentBasedQueryGeneratorService = DomainRegistry.resolve<DocumentBasedQueryGeneratorService>('DocumentBasedQueryGeneratorService');
  return documentBasedQueryGeneratorService.generateUpdateStatement(document, mutation);
};

const queryGeneratorDefinitions: IHttpApiDefinition[] = [
  {
    handler: generateUpdateStatement,
    path: '/query-generator/document-based/generateUpdateStatement',
    method: 'post',
  },
];

export const routes = queryGeneratorDefinitions;

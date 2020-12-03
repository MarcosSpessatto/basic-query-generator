import { inject, injectable } from 'tsyringe';
import { IDocumentBasedQueryGenerator, IDocumentBasedQueryOutput } from '../../domain/document-based/IDocumentBasedQueryGenerator';
import { IDocument } from '../../domain/document-based/IDocument';

@injectable()
export class DocumentBasedQueryGeneratorService {
  constructor(
      @inject('DocumentBasedQueryGenerator') private documentBasedQueryGenerator: IDocumentBasedQueryGenerator,
  ) {
  }

  generateUpdateStatement(document: IDocument, mutation: Record<string, any>): IDocumentBasedQueryOutput {
    return this.documentBasedQueryGenerator.generateUpdateStatement(document, mutation);
  }
}

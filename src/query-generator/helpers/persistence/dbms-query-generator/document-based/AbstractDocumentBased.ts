import { IDocument } from '@query-generator/domain/document-based/IDocument';
import { IDocumentBasedQueryOutput } from '@query-generator/domain/document-based/IDocumentBasedQueryGenerator';

export abstract class AbstractDocumentBased {
  protected subDocumentsKeysOnly(document: IDocument): string[] {
    return Object.keys(document)
      .filter((property) => Array.isArray(document[property]));
  }

  protected removeUnnecessaryOutputItems(output: Record<string, any>): IDocumentBasedQueryOutput {
    return Object.keys(output)
      .filter((key) => Object.keys(output[key]).length)
      .reduce((acc, key) => {
        acc[key] = output[key];
        return acc;
      }, {});
  }
}

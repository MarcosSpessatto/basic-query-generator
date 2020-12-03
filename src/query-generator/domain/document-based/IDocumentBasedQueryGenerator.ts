import { IDocument } from './IDocument';

export interface IDocumentBasedQueryOutput {
    $add?: Record<string, any>;
    $update?: Record<string, any>;
    $remove?: Record<string, any>;
}

export interface IDocumentBasedQueryGenerator {
    generateUpdateStatement(document: IDocument, mutation: Record<string, any>): IDocumentBasedQueryOutput;
}

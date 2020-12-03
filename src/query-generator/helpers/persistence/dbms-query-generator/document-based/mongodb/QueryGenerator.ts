import { injectable } from 'tsyringe';
import {
  IDocumentBasedQueryGenerator,
  IDocumentBasedQueryOutput,
} from '@query-generator/domain/document-based/IDocumentBasedQueryGenerator';
import { IDocument } from '@query-generator/domain/document-based/IDocument';
import { AbstractDocumentBased } from '@query-generator/helpers/persistence/dbms-query-generator/document-based/AbstractDocumentBased';

interface ITraverseMutationInput {
    document: IDocument[];
    mutationSubDocument: IDocument[];
    mutationProperty: string;
    result: IDocumentBasedQueryOutput;
    outputObjectKey?: string;
}

const DELETE_KEYWORD = '_delete';
const ID_KEYWORD = '_id';

@injectable()
export class MongoDBQueryGenerator extends AbstractDocumentBased implements IDocumentBasedQueryGenerator {
  generateUpdateStatement(document: IDocument, mutation: Record<string, any>): IDocumentBasedQueryOutput {
    const queryOutput = this.subDocumentsKeysOnly(mutation).reduce((accumulator, mutationProperty) => {
      const result = this.traverseDocument({
        document: document[mutationProperty] as IDocument[],
        mutationSubDocument: mutation[mutationProperty],
        mutationProperty,
        result: { $add: {}, $remove: {}, $update: {} },
      });
      return { ...accumulator, ...result };
    }, {});
    return this.removeUnnecessaryOutputItems(queryOutput);
  }

  private traverseDocument({
    document,
    mutationSubDocument,
    mutationProperty,
    outputObjectKey = undefined,
    result,
  }: ITraverseMutationInput): IDocumentBasedQueryOutput {
    return mutationSubDocument.reduce((resultAccumulator, mutationItem) => {
      // eslint-disable-next-line no-underscore-dangle
      const insertOperation = !mutationItem._id;
      if (insertOperation) {
        resultAccumulator.$add[outputObjectKey || mutationProperty] = [mutationItem];
      }
      // eslint-disable-next-line no-underscore-dangle
      const subDocumentItemIndex = document.findIndex((item) => item._id === mutationItem._id);
      const itemNotFound = subDocumentItemIndex === -1;
      if (itemNotFound) {
        return resultAccumulator;
      }
      // eslint-disable-next-line array-callback-return,consistent-return
      Object.entries(mutationItem).forEach(([mutationItemKey, mutationItemValue]) => {
        if (Array.isArray(mutationItemValue)) {
          const subItemExists = document[subDocumentItemIndex][mutationItemKey];
          if (!subItemExists) {
            return resultAccumulator;
          }
          return this.traverseDocument({
            document: document[subDocumentItemIndex][mutationItemKey] as IDocument[],
            mutationSubDocument: mutationItemValue,
            mutationProperty: mutationItemKey,
            outputObjectKey: `${mutationProperty}.${subDocumentItemIndex}.${mutationItemKey}`,
            result,
          });
        }
        // eslint-disable-next-line no-underscore-dangle
        const deleteOperation = mutationItem._delete === true;
        if (deleteOperation) {
          resultAccumulator.$remove[`${outputObjectKey || mutationProperty}.${subDocumentItemIndex}`] = true;
        }
        const reservedWord = mutationItemKey === DELETE_KEYWORD || mutationItemKey === ID_KEYWORD;
        if (!reservedWord) {
          resultAccumulator.$update = { [`${outputObjectKey || mutationProperty}.${subDocumentItemIndex}.${mutationItemKey}`]: mutationItemValue };
        }
      });
      return resultAccumulator;
    }, result);
  }
}

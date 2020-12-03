import { Handler } from 'express';

export interface IHttpApiDefinition {
  handler: Handler;
  path: string;
  method: 'get' | 'post' | 'put' | 'delete';
}

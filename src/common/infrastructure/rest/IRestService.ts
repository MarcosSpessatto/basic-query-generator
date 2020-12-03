import { IncomingMessage, ServerResponse } from 'http';

export interface IRestService {
  setup(baseDir: string, origin: string, moduleNames: string[]): Promise<(req: IncomingMessage, res: ServerResponse) => void>;
}

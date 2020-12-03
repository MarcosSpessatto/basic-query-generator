import { readdir } from 'fs';
import { join } from 'path';
import { promisify } from 'util';

const readdirPromisified = promisify(readdir);

export async function loadModules(absolutePath: string): Promise<any[]> {
  const filePaths = await readdirPromisified(absolutePath);
  const promises = filePaths.map(async (filePath: string) => import(join(absolutePath, filePath)));
  return Promise.all(promises);
}

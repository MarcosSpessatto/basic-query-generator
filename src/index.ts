import './polyfills';

import { container } from 'tsyringe';
import '@common/infrastructure/container';
import { App } from '@common/infrastructure/App';

const app = container.resolve(App);
const baseDir = __dirname;
app.start(baseDir);

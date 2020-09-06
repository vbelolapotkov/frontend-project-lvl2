import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

/* eslint-disable no-underscore-dangle */
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
/* eslint-enable no-underscore-dangle */

export default {
  globals: {
    fixturesPath: resolve(__dirname, '__fixtures__')
  }
};
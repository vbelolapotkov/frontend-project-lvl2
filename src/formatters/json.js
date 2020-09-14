import { flatten } from './utils.js';

export default (diff) => JSON.stringify(flatten(diff));

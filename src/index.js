import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import parseConfig from './parsers.js';
import formatters from './formatters/index.js';

// Node ES modules does not support named exports from lodash.
const { isPlainObject } = _;

const getDiffType = (previousValue, currentValue) => {
  if (previousValue === currentValue) {
    return 'unchanged';
  }

  if (previousValue !== undefined && currentValue === undefined) {
    return 'deleted';
  }

  if (previousValue === undefined && currentValue !== undefined) {
    return 'added';
  }

  return 'changed';
};

const getObjectsDiff = (obj1, obj2) => {
  const sortedKeys = _.sortBy(_.union(Object.keys(obj1), Object.keys(obj2)));
  return sortedKeys.flatMap((key) => {
    const value1 = obj1[key];
    const value2 = obj2[key];

    if (isPlainObject(value1) && isPlainObject(value2)) {
      return {
        key,
        children: getObjectsDiff(value1, value2),
      };
    }

    const type = getDiffType(value1, value2);
    const diffNode = { key, type, value: value2 };

    if (type !== 'unchanged') {
      diffNode.prevValue = value1;
    }

    return diffNode;
  });
};

const readConfigFromFile = (filepath) => {
  const absPath = path.resolve(process.cwd(), filepath);
  const format = path.extname(absPath).slice(1); // Use file extension without . as a format.
  const fileContent = fs.readFileSync(absPath, 'utf-8');
  return parseConfig(fileContent, format);
};

export default function genDiff(filepath1, filepath2, format = 'stylish') {
  const formatDiff = formatters[format];
  if (typeof formatDiff !== 'function') {
    throw new Error(`Unsupported format '${format}'`);
  }

  const config1 = readConfigFromFile(filepath1);
  const config2 = readConfigFromFile(filepath2);

  const diff = {
    children: getObjectsDiff(config1, config2),
  };
  return formatDiff(diff);
}

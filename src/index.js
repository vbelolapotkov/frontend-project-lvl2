import _ from 'lodash';
import readConfigFromFile from './parsers.js';
import stylish from './formatters';

// Node ES modules does not support named exports from lodash.
const { isPlainObject } = _;

const getObjectsDiff = (obj1, obj2) => {
  const uniqKeys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);
  const sortedKeys = Array.from(uniqKeys.values()).sort();
  return sortedKeys.flatMap((key) => {
    const value1 = obj1[key];
    const value2 = obj2[key];

    if (value1 === value2) {
      return [
        {
          key,
          value: value1,
          diffType: 'same',
        },
      ];
    }

    if (isPlainObject(value1) && isPlainObject(value2)) {
      return {
        key,
        diffType: 'same',
        children: getObjectsDiff(value1, value2),
      };
    }

    const keyDiff = [];

    if (value1 !== undefined) {
      keyDiff.push({
        key,
        value: value1,
        diffType: 'removed',
      });
    }

    if (value2 !== undefined) {
      keyDiff.push({
        key,
        value: value2,
        diffType: 'added',
      });
    }

    return keyDiff;
  });
};

export default function genDiff(filepath1, filepath2) {
  const config1 = readConfigFromFile(filepath1);
  const config2 = readConfigFromFile(filepath2);

  const diff = {
    children: getObjectsDiff(config1, config2),
  };
  return stylish(diff);
}

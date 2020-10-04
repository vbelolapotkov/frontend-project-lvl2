import _ from 'lodash';

// Node ES modules does not support named exports from lodash.
const { isPlainObject, has } = _;

const getObjectsDiff = (obj1, obj2) => {
  const sortedKeys = _.sortBy(_.union(Object.keys(obj1), Object.keys(obj2)));
  return sortedKeys.flatMap((key) => {
    const value1 = obj1[key];
    const value2 = obj2[key];

    if (isPlainObject(value1) && isPlainObject(value2)) {
      return {
        key,
        type: 'nested',
        children: getObjectsDiff(value1, value2),
      };
    }

    if (value1 === value2) {
      return {
        key,
        type: 'unchanged',
        value: value2,
      }
    }

    if (has(obj1, key) && !has(obj2, key)) {
      return {
        key,
        type: 'deleted',
        prevValue: value1,
      }
    }

    if (!has(obj1, key) && has(obj2, key)) {
      return {
        key,
        type: 'added',
        value: value2,
      };
    }

    return {
      key,
      type: 'changed',
      prevValue: value1,
      value: value2,
    }
  });
};


export default function makeDiffTree(data1, data2) {
  return {
    type: 'nested',
    children: getObjectsDiff(data1, data2),
  };
}
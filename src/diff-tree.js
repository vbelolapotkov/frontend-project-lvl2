import _ from 'lodash';

// Node ES modules does not support named exports from lodash.
const { isPlainObject, has, isEqual } = _;

const getObjectsDiff = (obj1, obj2) => {
  const sortedKeys = _.sortBy(_.union(Object.keys(obj1), Object.keys(obj2)));
  return sortedKeys.flatMap((key) => {
    if (!has(obj1, key)) {
      return {
        key,
        type: 'added',
        currentValue: obj2[key],
      };
    }

    if (!has(obj2, key)) {
      return {
        key,
        type: 'deleted',
        prevValue: obj1[key],
      };
    }

    if (isPlainObject(obj1[key]) && isPlainObject(obj2[key])) {
      return {
        key,
        type: 'nested',
        children: getObjectsDiff(obj1[key], obj2[key]),
      };
    }

    if (isEqual(obj1[key], obj2[key])) {
      return {
        key,
        type: 'unchanged',
        currentValue: obj2[key],
      };
    }

    return {
      key,
      type: 'changed',
      prevValue: obj1[key],
      currentValue: obj2[key],
    };
  });
};

const makeDiffTree = (data1, data2) => {
  return {
    type: 'root',
    children: getObjectsDiff(data1, data2),
  };
};

export default makeDiffTree;

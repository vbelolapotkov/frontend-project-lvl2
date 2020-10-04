import _ from 'lodash';

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


export default function makeDiffTree(data1, data2) {
  return {
    children: getObjectsDiff(data1, data2),
  };
}
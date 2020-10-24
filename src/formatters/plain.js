import _ from 'lodash';
import { flatten } from './utils.js';

const valueToString = (value) => {
  if (_.isObject(value)) {
    return '[complex value]';
  }

  if (typeof value === 'string') {
    return `'${value}'`;
  }
  return value.toString();
};

const composeChangeLine = ({ type, key, currentValue, prevValue }) => {
  switch (type) {
    case 'added':
      return `Property '${key}' was added with value: ${valueToString(currentValue)}`;
    case 'deleted':
      return `Property '${key}' was removed`;
    case 'changed':
      return `Property '${key}' was updated. From ${valueToString(
        prevValue
      )} to ${valueToString(currentValue)}`;
    default:
      throw Error(`Unexpected diff type ${type}`);
  }
};

export default (diff) =>
  flatten(diff)
    .filter(({ type }) => type !== 'unchanged')
    .map(composeChangeLine)
    .join('\n');

import _ from 'lodash';
import { flatten } from './utils.js';

function valueToString(value) {
  if (_.isObject(value)) {
    return '[complex value]';
  }

  if (typeof value === 'string') {
    return `'${value}'`;
  }
  return value.toString();
}

function composeChangeLine({ type, key, value, prevValue }) {
  switch (type) {
    case 'added':
      return `Property '${key}' was added with value: ${valueToString(value)}`;
    case 'deleted':
      return `Property '${key}' was removed`;
    case 'changed':
      return `Property '${key}' was updated. From ${valueToString(
        prevValue
      )} to ${valueToString(value)}`;
    default:
      throw Error(`Unexpected diff type ${type}`);
  }
}

export default (diff) =>
  flatten(diff)
    .filter(({ type }) => type !== 'unchanged')
    .map(composeChangeLine)
    .join('\n');

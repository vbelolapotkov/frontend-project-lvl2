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

function composeChangeLine({ change, key, value, fromValue, toValue }) {
  switch (change) {
    case 'added':
      return `Property '${key}' was added with value: ${valueToString(value)}`;
    case 'removed':
      return `Property '${key}' was removed`;
    case 'updated':
      return `Property '${key}' was updated. From ${valueToString( fromValue )} to ${valueToString(toValue)}`;
    default:
      throw Error(`Unexpected change type ${change}`);
  }
}

export default (diff) =>
  flatten(diff)
    .filter(({ change }) => change !== 'none')
    .map(composeChangeLine)
    .join('\n');

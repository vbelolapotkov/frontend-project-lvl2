import _ from 'lodash';

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
  if (change === 'added') {
    return `Property '${key}' was added with value: ${valueToString(value)}`;
  }

  if (change === 'removed') {
    return `Property '${key}' was removed`;
  }

  return `Property '${key}' was updated. From ${valueToString(
    fromValue
  )} to ${valueToString(toValue)}`;
}

function flatten(diff, path = []) {
  if (!diff.key) {
    return [...diff.children.flatMap((child) => flatten(child, path))];
  }

  const currentPath = [...path, diff.key];

  if (diff.children && diff.children.length > 0) {
    return [...diff.children.flatMap((child) => flatten(child, currentPath))];
  }

  const pathKey = currentPath.join('.');

  if (diff.prevValue === undefined && diff.nextValue !== undefined) {
    return [{ key: pathKey, change: 'added', value: diff.nextValue }];
  }

  if (diff.prevValue !== undefined && diff.nextValue === undefined) {
    return [{ key: pathKey, change: 'removed', value: diff.prevValue }];
  }

  if (diff.prevValue === diff.nextValue) {
    return [{ key: pathKey, change: 'none', value: diff.prevValue }];
  }

  return [
    {
      key: pathKey,
      change: 'updated',
      fromValue: diff.prevValue,
      toValue: diff.nextValue,
    },
  ];
}

export default (diff) =>
  flatten(diff)
    .filter(({ change }) => change !== 'none')
    .map(composeChangeLine)
    .join('\n');

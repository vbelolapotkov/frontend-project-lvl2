import _ from 'lodash';
import { getChange } from './utils.js';

const getIndent = path => '    '.repeat(path.length);
const setIndent = (str, path) => _.padStart(str, getIndent(path).length);

const composeDiffValueLines = (path, value, diffSymbol = '  ') => {
  const key = _.last(path);
  const indent = setIndent(diffSymbol, path);
  return _.isPlainObject(value)
    ? [
        `${indent}${key}: {`,
        ...Object.keys(value).flatMap((objectKey) =>
          composeDiffValueLines(
            [...path, objectKey],
            value[objectKey]
          )
        ),
        `${getIndent(path)}}`,
      ]
    : [`${indent}${key}: ${value}`];
};

const composeDiffLines = (diff, path = []) => {
  const currentPath = diff.key ? [...path, diff.key] : path;

  if (diff.children && diff.children.length > 0) {
    const keyStr = diff.key ? `${diff.key}: ` : '';
    const indent = getIndent(currentPath);
    return [
      `${indent}${keyStr}{`,
      ...diff.children.flatMap((child) => composeDiffLines(child, currentPath)),
      `${indent}}`,
    ];
  }

  const change = getChange(diff.prevValue, diff.nextValue);

  switch (change) {
    case 'added':
      return composeDiffValueLines(currentPath, diff.nextValue, '+ ');
    case 'removed':
      return composeDiffValueLines(currentPath, diff.prevValue, '- ');
    case 'updated':
      return [
        ...composeDiffValueLines(currentPath, diff.prevValue, '- '),
        ...composeDiffValueLines(currentPath, diff.nextValue, '+ '),
      ];
    default:
      return composeDiffValueLines(currentPath, diff.nextValue);
  }
};

export default (diff) => composeDiffLines(diff).join('\n');
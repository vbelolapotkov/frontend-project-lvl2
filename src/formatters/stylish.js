import _ from 'lodash';

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

  switch (diff.type) {
    case 'added':
      return composeDiffValueLines(currentPath, diff.value, '+ ');
    case 'deleted':
      return composeDiffValueLines(currentPath, diff.prevValue, '- ');
    case 'changed':
      return [
        ...composeDiffValueLines(currentPath, diff.prevValue, '- '),
        ...composeDiffValueLines(currentPath, diff.value, '+ '),
      ];
    case 'unchanged':
      return composeDiffValueLines(currentPath, diff.value);
    default:
      return [];
  }
};

export default (diff) => composeDiffLines(diff).join('\n');
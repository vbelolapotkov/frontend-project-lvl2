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
  if (!diff.key) {
    return [
      `${getIndent(path)}{`,
      ...diff.children.flatMap((child) => composeDiffLines(child, path)),
      `${getIndent(path)}}`,
    ];
  }

  const currentPath = [...path, diff.key];

  if (diff.children && diff.children.length > 0) {
    return [
      `${getIndent(currentPath)}${diff.key}: {`,
      ...diff.children.flatMap((child) => composeDiffLines(child, currentPath)),
      `${getIndent(currentPath)}}`,
    ];
  }

  if (diff.prevValue === undefined && diff.nextValue !== undefined) {
    return composeDiffValueLines(currentPath, diff.nextValue, '+ ');
  }

  if (diff.prevValue !== undefined && diff.nextValue === undefined) {
    return composeDiffValueLines(currentPath, diff.prevValue, '- ');
  }

  if (diff.prevValue === diff.nextValue) {
    return composeDiffValueLines(currentPath, diff.prevValue);
  }

  return [
    ...composeDiffValueLines(currentPath, diff.prevValue, '- '),
    ...composeDiffValueLines(currentPath, diff.nextValue, '+ '),
  ];
};

export default (diff) => composeDiffLines(diff).join('\n');
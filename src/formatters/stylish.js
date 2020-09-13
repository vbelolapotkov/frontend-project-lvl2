import _ from 'lodash';

const getNextIndent = (indent, key) => {
  const indentStep = '  ';
  return key ? `${indent}  ${indentStep}` : indent + indentStep;
};

const composeDiffValueLines = (indent, key, value, diffSymbol = ' ') => {
  return _.isPlainObject(value)
    ? [
        `${indent}${diffSymbol} ${key}: {`,
        ...Object.keys(value).flatMap((objectKey) =>
          composeDiffValueLines(
            getNextIndent(indent, objectKey),
            objectKey,
            value[objectKey],
          )
        ),
        `${indent}  }`,
      ]
    : [`${indent}${diffSymbol} ${key}: ${value}`];
};

const composeDiffLines = (diff, indent = '') => {
  if (diff.children && diff.children.length > 0) {
    const keyString = diff.key ? `  ${diff.key}: ` : '';
    const nextIndent = getNextIndent(indent, diff.key);
    return [
      `${indent}${keyString}{`,
      ...diff.children.flatMap((child) => composeDiffLines(child, nextIndent)),
      `${indent}${keyString.length ? '  ' : ''}}`,
    ];
  }

  if (diff.prevValue === undefined && diff.nextValue !== undefined) {
    return composeDiffValueLines(indent, diff.key, diff.nextValue, '+');
  }

  if (diff.prevValue !== undefined && diff.nextValue === undefined) {
    return composeDiffValueLines(indent, diff.key, diff.prevValue, '-');
  }

  if (diff.prevValue !== diff.nextValue) {
    return [
      ...composeDiffValueLines(indent, diff.key, diff.prevValue, '-'),
      ...composeDiffValueLines(indent, diff.key, diff.nextValue, '+'),
    ];
  }

  return `${indent}  ${diff.key}: ${diff.prevValue}`;
};

export default function stylish(diff) {
  const lines = composeDiffLines(diff);
  return lines.join('\n');
}

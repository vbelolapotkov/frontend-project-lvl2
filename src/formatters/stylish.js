import _ from 'lodash';

const getIndent = depth => '    '.repeat(depth);
const setIndent = (str, depth) => _.padStart(str, getIndent(depth).length);

const composeDiffValueLines = (key, value, diffSymbol, depth) => {
  return _.isPlainObject(value)
    ? [
        `${setIndent(diffSymbol, depth)}${key}: {`,
        ...Object.keys(value).flatMap((objectKey) =>
          composeDiffValueLines(objectKey, value[objectKey], '  ', depth + 1)
        ),
        `${getIndent(depth)}}`,
      ]
    : [`${setIndent(diffSymbol, depth)}${key}: ${value}`];
};

const composeDiffLines = (node, depth = 0) => {
  switch (node.type) {
    case 'nested': {
        const keyStr = node.key ? `${node.key}: ` : '';
        const indent = getIndent(depth);
        return [
          `${indent}${keyStr}{`,
          ...node.children.flatMap((child) =>
            composeDiffLines(child, depth + 1)
          ),
          `${indent}}`,
        ];
      }
    case 'added':
      return composeDiffValueLines(node.key, node.value, '+ ', depth);
    case 'deleted':
      return composeDiffValueLines(node.key, node.prevValue, '- ', depth);
    case 'changed':
      return [
        ...composeDiffValueLines(node.key, node.prevValue, '- ', depth),
        ...composeDiffValueLines(node.key, node.value, '+ ', depth),
      ];
    case 'unchanged':
      return composeDiffValueLines(node.key, node.value, '  ', depth);
    default:
      throw new Error(`Unexpected diff type: ${node.type}.`);
  }
};

export default (diff) => composeDiffLines(diff).join('\n');
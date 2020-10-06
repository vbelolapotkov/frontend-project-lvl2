import _ from 'lodash';

const DEFAULT_TAB = '  '; // two spaces

const getIndent = (depth, tab = DEFAULT_TAB) => tab.repeat(depth);
const padIndent = (str, depth) => depth > 0 ? _.padStart(str, getIndent(depth).length) : '';

const composeDiffValueLines = (key = '', value, diffSymbol, depth) => {
  return _.isPlainObject(value)
    ? [
        `${getIndent(depth)}${padIndent(diffSymbol, depth)}${key}: {`,
        ...Object.keys(value).flatMap((objectKey) =>
          composeDiffValueLines(objectKey, value[objectKey], '  ', depth + 1)
        ),
        `${getIndent(depth)}${padIndent('  ', depth)}}`,
      ]
    : [`${getIndent(depth)}${padIndent(diffSymbol, depth)}${key}: ${value}`];
};

const composeDiffLines = (node, depth = 0) => {
  switch (node.type) {
    case 'nested': {
        const keyStr = node.key ? `${node.key}: ` : '';
        const indent = getIndent(depth);
        return [
          `${indent}${padIndent('  ', depth)}${keyStr}{`,
          ...node.children.flatMap((child) =>
            composeDiffLines(child, depth + 1)
          ),
          `${indent}${padIndent('  ', depth)}}`,
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
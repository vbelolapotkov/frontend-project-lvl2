import _ from 'lodash';

const DEFAULT_TAB = '  '; // two spaces

const composeIndent = (level, tab = DEFAULT_TAB) => tab.repeat(level);

const getIndent = (depth, tab) => {
  // Add one tab from the previous level.
  const level = Math.max(0, 2 * (depth - 1) + 1);
  return composeIndent(level, tab);
};

const getClosingIndent = (depth, tab) => {
  return composeIndent(2 * depth, tab);
};

const composeValueLines = (value, depth, nodeMappers) =>
  _.isPlainObject(value)
    ? [
        '{',
        ...Object.keys(value).flatMap(
          (key) => nodeMappers.unchanged({ key, value: value[key] }, depth + 1),
          depth + 1
        ),
        `${getClosingIndent(depth)}}`,
      ]
    : [value.toString()];

const nodeMappers = {
  nested: (node, depth, composeNodeLines) => {
    const { key } = node;
    return [
      key ? `${getIndent(depth)}  ${key}: {` : `${getIndent(depth)}{`,
      ...node.children.flatMap((child) => composeNodeLines(child, depth + 1)),
      `${getClosingIndent(depth)}}`,
    ];
  },
  added: ({ key = '', value }, depth) =>
    `${getIndent(depth)}+ ${key}: ${composeValueLines(
      value,
      depth,
      nodeMappers
    ).join('\n')}`,
  deleted: ({ key = '', prevValue }, depth) =>
    `${getIndent(depth)}- ${key}: ${composeValueLines(
      prevValue,
      depth,
      nodeMappers
    ).join('\n')}`,
  changed: (node, depth) => [
    nodeMappers.deleted(node, depth),
    nodeMappers.added(node, depth),
  ],
  unchanged: ({ key, value }, depth) =>
    `${getIndent(depth)}  ${key}: ${composeValueLines(
      value,
      depth,
      nodeMappers
    ).join('\n')}`,
};

const composeDiffLines = (node, depth = 0) =>
  nodeMappers[node.type](node, depth, composeDiffLines);

export default (diff) => composeDiffLines(diff).join('\n');

import _ from 'lodash';

const DEFAULT_TAB = ' '.repeat(2);

const composeIndent = (level, tab = DEFAULT_TAB) => tab.repeat(level);

const getIndent = (depth, tab) => {
  // Add one tab from the previous level.
  const level = Math.max(0, 2 * (depth - 1) + 1);
  return composeIndent(level, tab);
};

const getClosingIndent = (depth, tab) => {
  return composeIndent(2 * depth, tab);
};

const valueToString = (value, depth, nodeMappers) => {
  if (!_.isPlainObject(value)) {
    return value.toString();
  }

  const lines = Object.keys(value).flatMap(
    (key) => nodeMappers.unchanged({ key, value: value[key] }, depth + 1),
    depth + 1
  );

  return `{\n${lines.join('\n')}\n${getClosingIndent(depth)}}`;
};

const nodeMappers = {
  root: (node, depth, composeNodeLines) => {
    return [
      '{',
      ...node.children.flatMap((child) => composeNodeLines(child, depth + 1)),
      '}',
    ].join('\n');
  },
  nested: ({ key, children }, depth, composeNodeLines) => {
    return [
      `${getIndent(depth)}  ${key}: {`,
      ...children.flatMap((child) => composeNodeLines(child, depth + 1)),
      `${getClosingIndent(depth)}}`,
    ].join('\n');
  },
  added: ({ key = '', value }, depth) =>
    `${getIndent(depth)}+ ${key}: ${valueToString(value, depth, nodeMappers)}`,
  deleted: ({ key = '', prevValue }, depth) =>
    `${getIndent(depth)}- ${key}: ${valueToString(
      prevValue,
      depth,
      nodeMappers
    )}`,
  changed: (node, depth) => [
    nodeMappers.deleted(node, depth),
    nodeMappers.added(node, depth),
  ],
  unchanged: ({ key, value }, depth) =>
    `${getIndent(depth)}  ${key}: ${valueToString(value, depth, nodeMappers)}`,
};

const composeDiffLines = (node, depth = 0) =>
  nodeMappers[node.type](node, depth, composeDiffLines);

export default (diff) => composeDiffLines(diff);

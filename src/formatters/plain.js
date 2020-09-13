import _ from 'lodash';

function valueToString(value) {
  if ( _.isObject(value) ) {
    return '[complex value]';
  }

  if (typeof value === 'string') {
    return `'${value}'`;
  }
  return value.toString();
}

function flatten (diff, path = []) {
  const diffs = [];
  if (diff.key && diff.prevValue !== diff.nextValue) {
    diffs.push({ diff, path: [...path, diff.key] });
  }

  if (diff.children && diff.children.length > 0) {
    const newPath = diff.key ? [...path, diff.key] : path;
    diffs.push(...diff.children.flatMap((child) => flatten(child, newPath)));
  }
  return diffs;
};

function composeDiffLines(diffTree) {
  const flatDiff = flatten(diffTree);

  return flatDiff.map(({ diff, path }) => {
    const propertyPath = path.join('.');
    if (diff.prevValue === undefined && diff.nextValue !== undefined) {
      return `Property '${propertyPath}' was added with value: ${valueToString(diff.nextValue)}`;
    }

    if (diff.prevValue !== undefined && diff.nextValue === undefined) {
      return `Property '${propertyPath}' was removed`;
    }

    return `Property '${propertyPath}' was updated. From ${valueToString(diff.prevValue)} to ${valueToString(diff.nextValue)}`;
  });
}

export default (diff) => composeDiffLines(diff).join('\n');
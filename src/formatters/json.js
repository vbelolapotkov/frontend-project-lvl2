function flatten(diff, path = []) {
  const diffs = [];

  if (!diff.key) {
    diffs.push(...diff.children.flatMap(child => flatten(child, path)));
    return diffs;
  }

  const currentPath = [...path, diff.key];

  if (diff.prevValue === undefined && diff.nextValue === undefined) {
    diffs.push(...diff.children.flatMap((child) => flatten(child, currentPath)));
    return diffs;
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

  return [{ key: pathKey, change: 'updated', fromValue: diff.prevValue, toValue: diff.nextValue }];
}

export default (diff) => JSON.stringify(flatten(diff));
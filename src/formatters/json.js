function flatten(diff, path = []) {
  if (!diff.key) {
    return [...diff.children.flatMap((child) => flatten(child, path))];
  }

  const currentPath = [...path, diff.key];

  if (diff.children && diff.children.length > 0) {
    return [...diff.children.flatMap((child) => flatten(child, currentPath))];
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

  return [
    {
      key: pathKey,
      change: 'updated',
      fromValue: diff.prevValue,
      toValue: diff.nextValue,
    },
  ];
}

export default (diff) => JSON.stringify(flatten(diff));

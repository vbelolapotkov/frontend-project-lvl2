/* eslint-disable import/prefer-default-export */

export function getChange(prevValue, nextValue) {
  if (prevValue === nextValue) {
    return 'none';
  }

  if (prevValue === undefined && nextValue !== undefined) {
    return 'added';
  }

  if (prevValue !== undefined && nextValue === undefined) {
    return 'removed';
  }

  return 'updated';
}

export function flatten(diff, path = []) {
  const currentPath = diff.key ? [...path, diff.key] : path;

  if (diff.children && diff.children.length > 0) {
    return [...diff.children.flatMap((child) => flatten(child, currentPath))];
  }

  const pathKey = currentPath.join('.');
  const change = getChange(diff.prevValue, diff.nextValue);

  if (change === 'updated') {
    return [
      {
        key: pathKey,
        change: 'updated',
        fromValue: diff.prevValue,
        toValue: diff.nextValue,
      },
    ];
  }

  const value = change === 'removed' ? diff.prevValue : diff.nextValue;
  return [{ key: pathKey, change, value }];
}
/* eslint-disable import/prefer-default-export */

export function flatten(diff, path = []) {
  const currentPath = diff.key ? [...path, diff.key] : path;

  if (diff.children && diff.children.length > 0) {
    return [...diff.children.flatMap((child) => flatten(child, currentPath))];
  }

  const pathKey = currentPath.join('.');
  return [{ ...diff, key: pathKey }];
}
/* eslint-disable import/prefer-default-export */

export function flatten(diffTree) {
  const iter = (diff, path) => {
    const currentPath = diff.key ? [...path, diff.key] : path;

    if (diff.children && diff.children.length > 0) {
      return [...diff.children.flatMap((child) => iter(child, currentPath))];
    }

    const pathKey = currentPath.join('.');
    return [{ ...diff, key: pathKey }];
  }

  return iter(diffTree, []);
}
/* eslint-disable import/prefer-default-export */

export const flatten = (diffTree) => {
  const iter = (diff, path) => {
    const currentPath = diff.key ? [...path, diff.key] : path;

    if (diff.type === 'nested' || diff.type === 'root') {
      return [...diff.children.flatMap((child) => iter(child, currentPath))];
    }

    const pathKey = currentPath.join('.');
    return [{ ...diff, key: pathKey }];
  };

  return iter(diffTree, []);
};

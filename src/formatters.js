import _ from 'lodash';

// Node ES modules does not support named exports from lodash.
const { isPlainObject, padStart } = _;

const composeDiffTypeStr = diffType => {
  const diffTypeSymbols = {
    added: '+',
    removed: '-',
    same: ' ',
  };

  return diffType && diffTypeSymbols[diffType]
    ? `${diffTypeSymbols[diffType]} `
    : '';

}

const composeDiffLines = (diff, indent) => {
  const indentStep = '  ';
  const diffTypeStr = composeDiffTypeStr(diff.diffType);

  let line = indent + diffTypeStr;

  if (diff.value !== undefined && !isPlainObject(diff.value)) {
    line += `${diff.key}: ${diff.value}`;
    return [line];
  }

  const diffLines = [];

  if (diff.key) {
    line += `${diff.key}: `;
  }
  line += '{';
  diffLines.push(line);

  const nextIndent = padStart(
    indent,
    indent.length + diffTypeStr.length + indentStep.length
  );

  if (isPlainObject(diff.value)) {
    diffLines.push(
      ...Object.keys(diff.value).flatMap((key) =>
        composeDiffLines({ key, value: diff.value[key], diffType: 'same' }, nextIndent)
      )
    );
  }

  if (diff.children && diff.children.length > 0) {
    diffLines.push(
      ...diff.children.flatMap((child) => composeDiffLines(child, nextIndent))
    );
  }

  const closingIndent = padStart(indent, indent.length + diffTypeStr.length);
  diffLines.push(`${closingIndent}}`);

  return diffLines;
};

export default function stylish(diff) {
  const lines = composeDiffLines(diff, '');
  return lines.join('\n');
}
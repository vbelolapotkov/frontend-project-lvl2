import _ from 'lodash';

// Node ES modules does not support named exports from lodash.
const { isPlainObject, padStart } = _;

export default function stylish(diff) {
  const indentStep = '  ';
  const diffTypeSymbols = {
    added: '+',
    removed: '-',
    same: ' ',
  };
  const getLines = (diff, indent) => {
    const diffLines = [];
    let line = indent;

    const diffTypeStr =
      diff.diffType && diffTypeSymbols[diff.diffType]
        ? `${diffTypeSymbols[diff.diffType]} `
        : '';

    line += diffTypeStr;

    if (diff.value !== undefined && !isPlainObject(diff.value)) {
      line += `${diff.key}: ${diff.value}`;
      diffLines.push(line);
      return diffLines;
    }

    if (diff.key) {
      line += `${diff.key}: `;
    }
    line += '{';
    diffLines.push(line);

    const nextIndent = padStart(
      indent,
      indent.length + indentStep.length + diffTypeStr.length
    );

    if (isPlainObject(diff.value)) {
      diffLines.push(
        ...Object.keys(diff.value).flatMap((key) =>
          getLines(
            { key, value: diff.value[key], diffType: 'same' },
            nextIndent
          )
        )
      );
    }

    if (diff.children && diff.children.length > 0) {
      diffLines.push(
        ...diff.children.flatMap((child) => getLines(child, nextIndent))
      );
    }

    const closingIndent = padStart(
      indent,
      indent.length + diffTypeStr.length
    );
    diffLines.push(`${closingIndent}}`);

    return diffLines;
  };

  const lines = getLines(diff, '');
  return lines.join('\n');
}
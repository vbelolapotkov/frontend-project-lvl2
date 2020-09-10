import _ from 'lodash';
import readConfigFromFile from './parsers.js';

function isObject (variable) {
  return  typeof variable === 'object' && variable !== null && ! Array.isArray(variable);
}

function stylish(diff) {
  const indentStep = '  ';
  const diffTypeSymbols = {
    added: '+',
    removed: '-',
    same: ' ',
  };
  const getLines = (diff, indent) => {
    const diffLines = []
    let line = indent;

    const diffTypeStr = diff.diffType && diffTypeSymbols[diff.diffType] ? `${diffTypeSymbols[diff.diffType]} ` : ''

    line += diffTypeStr;

    if ( diff.value !== undefined && !isObject(diff.value) ) {
      line += `${diff.key}: ${diff.value}`;
      diffLines.push(line);
      return diffLines;
    }

    if (diff.key) {
      line+= `${diff.key}: `
    }
    line += '{';
    diffLines.push(line);

    const nextIndent = _.padStart(
      indent,
      indent.length + indentStep.length + diffTypeStr.length
    );

    if (isObject(diff.value)) {
      diffLines.push(
        ...Object.keys(diff.value).flatMap(key => getLines({ key, value: diff.value[key], diffType: 'same' }, nextIndent))
      );
    }

    if (diff.children && diff.children.length > 0) {
      diffLines.push(
        ...diff.children.flatMap((child) => getLines(child, nextIndent))
      );
    }

    const closingIndent = _.padStart(
      indent,
      indent.length + diffTypeStr.length
    );
    diffLines.push(`${closingIndent}}`);

    return diffLines;
  }

  const lines = getLines(diff, '');
  return lines.join('\n');
}

function genDiffTree(obj1, obj2) {
  const getObjectsDiff = (obj1, obj2) => {
    const objectsDiff = [];
    const uniqKeys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);
    const sortedKeys = Array.from(uniqKeys.values()).sort();
    sortedKeys.forEach((key) => {
      const value1 = obj1[key];
      const value2 = obj2[key];
      if (value1 === value2) {
        objectsDiff.push({
          key,
          value: value1,
          diffType: 'same',
        });
        return;
      }

      if (isObject(value1) && isObject(value2)) {
        objectsDiff.push({
          key,
          diffType: 'same',
          children: getObjectsDiff(value1, value2),
        })
      } else {
        if (value1 !== undefined) {
          objectsDiff.push({
            key,
            value: value1,
            diffType: 'removed',
          });
        }

        if (value2 !== undefined) {
          objectsDiff.push({
            key,
            value: value2,
            diffType: 'added',
          });
        }
      }
    });


    return objectsDiff;
  };

  const diff = {
    children: getObjectsDiff(obj1, obj2)
  }

  return diff;
}

export default function genDiff(filepath1, filepath2) {
  const config1 = readConfigFromFile(filepath1);
  const config2 = readConfigFromFile(filepath2);

  const diff = genDiffTree(config1, config2);
  return stylish(diff);
}

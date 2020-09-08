import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const configParsers = {
  '.yml': yaml.safeLoad,
  default: JSON.parse,
};

function readConfigFromFile(filepath) {
  const absPath = path.resolve(process.cwd(), filepath);
  const format = path.extname(absPath);
  const fileContent = fs.readFileSync(absPath);
  const parse = typeof configParsers[format] === 'function' ? configParsers[format] : configParsers.default;
  return parse(fileContent);
}

function genObjectsDiff(obj1, obj2) {
  const uniqKeys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);
  const sortedKeys = Array.from(uniqKeys.values()).sort();

  const diffLines = ['{'];
  sortedKeys.forEach((key) => {
    if (obj1[key] === obj2[key]) {
      diffLines.push(`    ${key}: ${obj1[key]}`);
      return;
    }

    if (obj1[key] !== undefined) {
      diffLines.push(`  - ${key}: ${obj1[key]}`);
    }

    if (obj2[key] !== undefined) {
      diffLines.push(`  + ${key}: ${obj2[key]}`);
    }
  });

  diffLines.push('}');
  return diffLines;
}

export default function genDiff(filepath1, filepath2) {
  const config1 = readConfigFromFile(filepath1);
  const config2 = readConfigFromFile(filepath2);

  const diffLines = genObjectsDiff(config1, config2);
  return diffLines.join('\n');
}

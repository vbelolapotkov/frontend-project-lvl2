import fs from 'fs';
import path from 'path';

function readJsonFile(filepath) {
  const absPath = path.resolve(process.cwd(), filepath);
  const fileContent = fs.readFileSync(absPath);
  return JSON.parse(fileContent);
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
  const json1 = readJsonFile(filepath1);
  const json2 = readJsonFile(filepath2);

  const diffLines = genObjectsDiff(json1, json2);
  return diffLines.join('\n');
}

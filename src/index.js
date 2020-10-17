import fs from 'fs';
import path from 'path';
import parseConfig from './parsers.js';
import format from './formatters/index.js';
import makeDiffTree from './diff-tree.js';

const readConfigFromFile = (filepath) => {
  const absPath = path.resolve(process.cwd(), filepath);
  const fileFormat = path.extname(absPath).slice(1);
  const fileContent = fs.readFileSync(absPath, 'utf-8');
  return parseConfig(fileContent, fileFormat);
};

const genDiff = (filepath1, filepath2, outputFormat = 'stylish') => {
  const config1 = readConfigFromFile(filepath1);
  const config2 = readConfigFromFile(filepath2);
  const diffTree = makeDiffTree(config1, config2);
  return format(diffTree, outputFormat);
};

export default genDiff;

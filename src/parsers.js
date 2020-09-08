import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import ini from 'ini';

const configParsers = {
  '.yml': yaml.safeLoad,
  '.ini': ini.parse,
  default: JSON.parse,
};

export default function parseConfigFile(filepath) {
  const absPath = path.resolve(process.cwd(), filepath);
  const format = path.extname(absPath);
  const fileContent = fs.readFileSync(absPath, 'utf-8');
  const parse =
    typeof configParsers[format] === 'function'
      ? configParsers[format]
      : configParsers.default;
  return parse(fileContent);
}
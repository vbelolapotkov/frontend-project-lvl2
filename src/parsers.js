import yaml from 'js-yaml';
import ini from 'ini';

const configParsers = {
  'yml': yaml.safeLoad,
  'ini': ini.parse,
  'json': JSON.parse,
};

export default function parseConfigFile(fileContent, format = 'json') {
  const parse =
    typeof configParsers[format] === 'function'
      ? configParsers[format]
      : configParsers.json;
  return parse(fileContent);
}
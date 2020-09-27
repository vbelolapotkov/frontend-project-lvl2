import yaml from 'js-yaml';
import ini from 'ini';

const parsers = {
  'yml': yaml.safeLoad,
  'ini': ini.parse,
  'json': JSON.parse,
};

export default function parse(content, format = 'json') {
  if (!parsers[format]) {
    throw new Error(`Unsupported input format '${format}'. Use one of the following input formats: ${Object.keys(parsers).join(', ')}`);
  }

  return parsers[format](content);
}
import yaml from 'js-yaml';
import ini from 'ini';

const parsers = {
  yml: yaml.safeLoad,
  ini: ini.parse,
  json: JSON.parse,
};

const parse = (content, format) => {
  if (!parsers[format]) {
    throw new Error(
      `Unsupported input format '${format}'. Use one of the following input formats: ${Object.keys(
        parsers
      ).join(', ')}`
    );
  }

  return parsers[format](content);
};

export default parse;

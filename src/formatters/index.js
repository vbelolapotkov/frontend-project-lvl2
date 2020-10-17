import formatStylish from './stylish.js';
import formatPlain from './plain.js';
import formatJson from './json.js';

const formatters = {
  stylish: formatStylish,
  plain: formatPlain,
  json: formatJson,
};

const format = (tree, outputFormat) => {
  if (!formatters[outputFormat]) {
    throw new Error(`Unsupported output format '${outputFormat}'`);
  }

  return formatters[outputFormat](tree);
};

export default format;

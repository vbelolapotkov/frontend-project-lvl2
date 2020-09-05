#!/usr/bin/env node --experimental-json-modules --no-warnings
import commander from 'commander';
import packageConfig from '../package.json';

const program = new commander.Command();

program
  .description('Compares two configuration files and shows a difference.')
  .version(packageConfig.version)
  .option('-f, --format [type]', 'output format')
  .helpOption('-h, --help', 'output usage information')
  .arguments('<filepath1> <filepath2>')
  .parse(process.argv);

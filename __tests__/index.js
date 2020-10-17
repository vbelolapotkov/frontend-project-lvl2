import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';
import genDiff from '../src/index.js';

// Global constants __filename and __dirname are missing when ECMAScript modules are used.
// Use the following as a workaround. Src: https://ru.hexlet.io/blog/posts/chto-takoe-__dirname-v-javascript
/* eslint-disable no-underscore-dangle */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
/* eslint-enable no-underscore-dangle */

const getFixturePath = (fileName) =>
  path.resolve(__dirname, '../__fixtures__', fileName);
const readFixtureFile = (fileName) =>
  fs.readFileSync(getFixturePath(fileName), 'utf-8');

describe('genDiff', () => {
  // eslint-disable-next-line fp/no-let
  let plainDiff;

  beforeAll(() => {
    // eslint-disable-next-line fp/no-mutation
    plainDiff = readFixtureFile('plain_diff.txt');
  });

  test.each(['json', 'yml', 'ini'])(
    'should generate diff for plain %s files',
    (fileFormat) => {
      const diffAbs = genDiff(
        getFixturePath(`file1.${fileFormat}`),
        getFixturePath(`file2.${fileFormat}`)
      );
      expect(diffAbs).toBe(plainDiff);
    }
  );

  test.each([
    ['stylish', 'diff_stylish.txt'],
    ['plain', 'diff_plain.txt'],
    ['json', 'diff_json.json'],
  ])('should support %s output format', (outputFormat, fixtureFile) => {
    const expectedDiff = readFixtureFile(fixtureFile);
    const diff = genDiff(
      getFixturePath('file3.json'),
      getFixturePath('file4.json'),
      outputFormat
    );

    if (outputFormat === 'json') {
      // Parse diffs to make test output more helpful in case of failure.
      expect(JSON.parse(diff, null, 2)).toStrictEqual(
        JSON.parse(expectedDiff, null, 2)
      );
    } else {
      expect(diff).toBe(expectedDiff);
    }
  });

  test('should work with relative file paths', () => {
    const diff = genDiff(
      `./__fixtures__/file1.json`,
      `./__fixtures__/file2.json`
    );

    expect(diff).toBe(plainDiff);
  });

  test('should throw when config format is unknown', () => {
    const f = () =>
      genDiff(getFixturePath(`diff_plain.txt`), getFixturePath(`file1.json`));
    expect(f).toThrow("Unsupported input format 'txt'.");
  });

  test('should throw when output format is unknown', () => {
    const f = () =>
      genDiff(
        getFixturePath(`file3.json`),
        getFixturePath(`file4.json`),
        'wrong-format'
      );

    expect(f).toThrow("Unsupported output format 'wrong-format'");
  });
});

/* globals fixturesPath */
import fs from 'fs';
import path from 'path';
import genDiff from '../src/index.js';

const getFixturePath = (fileName) => path.resolve(fixturesPath, fileName);
const readFixtureFile = (fileName) => fs.readFileSync(getFixturePath(fileName), 'utf-8');

describe('genDiff', () => {
  let plainDiff;

  beforeAll(() => {
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

  test('should throw when output format is unknown', () => {
    const f = () =>
      genDiff(
        getFixturePath(`file3.json`),
        getFixturePath(`file4.json`),
        'wrong-format'
      );

    expect(f).toThrow("Unsupported format 'wrong-format'");
  });
});

/* globals fixturesPath */
import fs from 'fs';
import path from 'path'
import genDiff from '../src/index.js';

const formats = ['json', 'yml', 'ini'];

const getFixturePath = fileName => path.resolve(fixturesPath, fileName);
const readFixtureFile = fileName => fs.readFileSync(getFixturePath(fileName), 'utf-8');

describe('genDiff', () => {
  let plainDiff;

  beforeAll(() => {
    plainDiff = readFixtureFile('plain_diff.txt');
  });

  test.each(formats)('diff for plain %s files', (format) => {
    const diffAbs = genDiff(
      getFixturePath(`file1.${format}`),
      getFixturePath(`file2.${format}`),
    );
    expect(diffAbs).toBe(plainDiff);
  });


  test('should work with relative file paths', () => {
    const diff = genDiff(
      `./__fixtures__/file1.json`,
      `./__fixtures__/file2.json`
    );

    expect(diff).toBe(plainDiff);
  });


  test('diff for nested files in stylish format', () => {
    const stylishDiff = readFixtureFile('diff_stylish.txt')

    const diffAbs = genDiff(
      getFixturePath(`file3.json`),
      getFixturePath(`file4.json`),
    );

    expect(diffAbs).toBe(stylishDiff);
  });

  test('diff for nested files in plain format', () => {
    const diffPlain = readFixtureFile('diff_plain.txt');
    const diff = genDiff(
      getFixturePath(`file3.json`),
      getFixturePath(`file4.json`),
      'plain'
    );

    expect(diff).toBe(diffPlain);
  } );

  test('diff for nested files in json format', () => {
    const expectedDiff = JSON.parse(readFixtureFile('diff_json.json'), null, 2);
    const diff = genDiff(
      getFixturePath(`file3.json`),
      getFixturePath(`file4.json`),
      'json'
    );

    expect(JSON.parse(diff, null, 2)).toStrictEqual(expectedDiff);
  } );

  test('throws when format is unknown', () => {
    const f = () =>
      genDiff(
        getFixturePath(`file3.json`),
        getFixturePath(`file4.json`),
        'wrong-format'
      );

    expect(f).toThrow("Unsupported format 'wrong-format'");
  } );
});

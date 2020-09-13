/* globals fixturesPath */
import fs from 'fs';
import path from 'path'
import genDiff from '../src/index.js';

const formats = ['json', 'yml', 'ini'];

const readFixtureFile = fileName => fs.readFileSync(path.resolve(fixturesPath, fileName), 'utf-8');

describe('genDiff', () => {
  let plainDiff;

  beforeAll(() => {
    plainDiff = readFixtureFile('plain_diff.txt');
  });


  test.each(formats)('diff for plain %s files', (format) => {
    const diff = genDiff(
      `./__fixtures__/file1.${format}`,
      `./__fixtures__/file2.${format}`
    );

    expect(diff).toBe(plainDiff);

    const diffAbs = genDiff(
      path.resolve(fixturesPath, `./file1.${format}`),
      path.resolve(fixturesPath, `./file2.${format}`)
    );
    expect(diffAbs).toBe(plainDiff);
  });

  test('diff for nested files in stylish format', () => {
    const stylishDiff = readFixtureFile('diff_stylish.txt')
    const diff = genDiff(
      './__fixtures__/file3.json',
      './__fixtures__/file4.json'
    );

    expect(diff).toBe(stylishDiff);

    const diffAbs = genDiff(
      path.resolve(fixturesPath, './file3.json'),
      path.resolve(fixturesPath, './file4.json')
    );
    expect(diffAbs).toBe(stylishDiff);
  });

  test('diff for nested files in plain format', () => {
    const diffPlain = readFixtureFile('diff_plain.txt');
    const diff = genDiff(
      './__fixtures__/file3.json',
      './__fixtures__/file4.json',
      'plain'
    );

    expect(diff).toBe(diffPlain);
  } );

  test('diff for nested files in json format', () => {
    const expectedDiff = JSON.stringify(readFixtureFile('diff_json.json'));
    const diff = genDiff(
      './__fixtures__/file3.json',
      './__fixtures__/file4.json',
      'json'
    );

    expect(diff).toBe(expectedDiff);
  } );

  test('throws when format is unknown', () => {
    const f = () => genDiff(
      './__fixtures__/file3.json',
      './__fixtures__/file4.json',
      'wrong-format'
    );

    expect(f).toThrow("Unsupported format 'wrong-format'");
  } );
});

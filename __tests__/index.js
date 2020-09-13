/* globals fixturesPath */
import fs from 'fs';
import path from 'path'
import genDiff from '../src/index.js';

const formats = ['json', 'yml', 'ini'];

const readFixtureFile = fileName => fs.readFileSync(path.resolve(fixturesPath, fileName), 'utf-8');

describe('genDiff', () => {
  let plaindDiff;
  let nestedDiff;

  beforeAll(() => {
    plaindDiff = readFixtureFile('plain_diff.txt');
    nestedDiff = readFixtureFile('nested_diff.txt')
  });


  test.each(formats)('diff for plain %s files', (format) => {
    const diff = genDiff(
      `./__fixtures__/file1.${format}`,
      `./__fixtures__/file2.${format}`
    );

    expect(diff).toBe(plaindDiff);

    const diffAbs = genDiff(
      path.resolve(fixturesPath, `./file1.${format}`),
      path.resolve(fixturesPath, `./file2.${format}`)
    );
    expect(diffAbs).toBe(plaindDiff);
  });

  test('diff for nested json files', () => {
    const diff = genDiff(
      './__fixtures__/file3.json',
      './__fixtures__/file4.json'
    );

    expect(diff).toBe(nestedDiff);

    const diffAbs = genDiff(
      path.resolve(fixturesPath, './file3.json'),
      path.resolve(fixturesPath, './file4.json')
    );
    expect(diffAbs).toBe(nestedDiff);
  });
});

/* globals fixturesPath */
import fs from 'fs';
import path from 'path'
import genDiff from '../src/index.js';

const formats = ['json', 'yml'];
describe('genDiff', () => {
  let expectedDiff;

  beforeAll(() => {
    expectedDiff = fs.readFileSync(
      path.resolve(fixturesPath, './plain_diff.txt'),
      'utf-8'
    );
  });

  test.each(formats)('diff for plain %s file', (format) => {
    const diff = genDiff(
      `./__fixtures__/file1.${format}`,
      `./__fixtures__/file2.${format}`
    );

    expect(diff).toBe(expectedDiff);

    const diffAbs = genDiff(
      path.resolve(fixturesPath, `./file1.${format}`),
      path.resolve(fixturesPath, `./file2.${format}`)
    );
    expect(diffAbs).toBe(expectedDiff);
  });
});

/* globals fixturesPath */
import path from 'path'
import genDiff from '../src/index.js';

test('plain json diff', () => {
  const diff = genDiff('./__fixtures__/file1.json', './__fixtures__/file2.json');
  expect(diff).toMatchSnapshot();

  const diffAbs = genDiff(
    path.resolve(fixturesPath, './file1.json'),
    path.resolve(fixturesPath, './file2.json')
  );
  expect(diff).toBe(diffAbs);
});

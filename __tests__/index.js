/* globals fixturesPath */
import fs from 'fs';
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

test('plain yaml diff', () => {
  const expectedDiff = fs.readFileSync(path.resolve(fixturesPath, './plain_diff.txt'), 'utf-8');

  const diff = genDiff( './__fixtures__/file1.yml', './__fixtures__/file2.yml' );
  expect(diff).toEqual(expectedDiff);

  const diffAbs = genDiff(
    path.resolve(fixturesPath, './file1.yml'),
    path.resolve(fixturesPath, './file2.yml')
  );
  expect(diffAbs).toEqual(expectedDiff);
});

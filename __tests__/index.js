import genDiff from '../src/index.js';

test('plain json diff', () => {
  const diff = genDiff('./__fixtures__/file1.json', './__fixtures__/file2.json');
  expect(diff).toMatchSnapshot();
});

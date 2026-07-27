import assert from 'node:assert/strict';
import test from 'node:test';

import { shuffle } from './shuffle.js';

test('shuffle uses Fisher-Yates swaps without mutating the source array', () => {
  const source = ['one', 'two', 'three'];
  const randomValues = [0, 0];
  const random = () => randomValues.shift();

  assert.deepEqual(shuffle(source, random), ['two', 'three', 'one']);
  assert.deepEqual(source, ['one', 'two', 'three']);
});

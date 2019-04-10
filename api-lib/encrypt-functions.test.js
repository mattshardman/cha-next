const { parseKey, createKey } = require('./encrypt-functions');
const { testKey, publicTestKey, secretTestKey } = require('./test-data');


describe('test parse key function', () => {
  it('return an array', () => {
    const parsedKey = parseKey(testKey);
    expect(parsedKey.constructor).toBe(Array);
  });
});

describe('test create key function', () => {
  it('returns a Uint8Array', () => {
    const keyObj = {
      p: publicTestKey,
      s: secretTestKey,
    };
    const key = createKey(keyObj);
    expect(key.constructor).toBe(Uint8Array);
  });
});

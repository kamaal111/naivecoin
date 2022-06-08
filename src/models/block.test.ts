import Block from './block';

test('block properties are immutable', () => {
  const block = new Block({
    index: 420,
    hash: 'd6a2376e25361e7ca7ddb0fe8bd263eb60eb458331df0b0c8d077cf8b4abdbf6',
    previousHash:
      '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824',
    timestamp: 1652726828,
    data: 'You know',
    difficulty: 0,
    nonce: 0,
  });

  const t = () => (block.hash = '2');
  expect(t).toThrow(TypeError);
});

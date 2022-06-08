/* eslint-disable @typescript-eslint/ban-ts-comment */

import BlockChain from './blockchain';
import {calculateHash} from '../utils/hashing';

test('genesis block is hashed correctly', () => {
  const genesisBlock = BlockChain.GENESIS_BLOCK;
  expect(
    calculateHash({
      index: genesisBlock.index,
      previousHash: undefined,
      timestamp: genesisBlock.timestamp,
      data: genesisBlock.data,
      difficulty: genesisBlock.difficulty,
      nonce: genesisBlock.nonce,
    })
  ).toEqual(genesisBlock.hash);
});

test('generating next block', () => {
  const blockChain = new BlockChain();

  const genesisBlock = BlockChain.GENESIS_BLOCK;

  jest
    .spyOn(global.Date, 'now')
    .mockImplementationOnce(() =>
      new Date('2022-05-16T22:01:58.135Z').valueOf()
    );

  const data = 'new one';
  const generateNextBlockResult = blockChain.generateNextBlock(data);
  if ('error' in generateNextBlockResult) {
    fail(generateNextBlockResult.error.message);
  }

  const {value: newBlock} = generateNextBlockResult;

  expect(blockChain.chainLength).toEqual(2);
  expect(newBlock.previousHash).toEqual(genesisBlock.hash);
  expect(newBlock.data).toEqual(data);
  expect(newBlock.index).toEqual(1);
  expect(newBlock.timestamp).toEqual(1652738518);
  expect(newBlock.hash).toEqual(
    '18e1b9e326dca672d34ff40aa308bc5e52134528d404388aed552479e5a02e9b'
  );
});

/* eslint-disable @typescript-eslint/ban-ts-comment */

import {BlockChain} from './blockchain';
import {calculateHash} from './utils/hashing';

test('genesis block is hashed correctly', () => {
  const genesisBlock = BlockChain.GENESIS_BLOCK;
  expect(
    calculateHash({
      index: genesisBlock.index,
      previousHash: undefined,
      timestamp: genesisBlock.timestamp,
      data: genesisBlock.data,
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
  const newBlock = blockChain.generateNextBlock(data);
  expect(newBlock.previousHash).toEqual(genesisBlock.hash);
  expect(newBlock.data).toEqual(data);
  expect(newBlock.index).toEqual(1);
  expect(newBlock.timestamp).toEqual(1652738518);
  expect(newBlock.hash).toEqual(
    '5cf301933dd0af0dbd69fa472ab3bea9ce99d31442da41b4112be41ef249a74c'
  );
});

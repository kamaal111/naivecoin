import Block from './models/block';

import {calculateHash} from './utils/hashing';
import type {Result} from './types';

const GENESIS_BLOCK = new Block({
  index: 0,
  hash: 'cd2fb2ace926608315b2a5bd1bc2a259dce057a21ed63351adc0b1326da2a99e',
  previousHash: null,
  timestamp: 1652722519,
  data: 'The Genesis block!!!',
});

class BlockChain {
  private _blocks: Block[];

  constructor() {
    this._blocks = [BlockChain.GENESIS_BLOCK];
  }

  public get blocks() {
    return this._blocks;
  }

  public get chainLength() {
    return this.blocks.length;
  }

  public getLatestBlock() {
    return this.blocks[this.chainLength - 1];
  }

  public generateNextBlock(data: string): Result<Block, InvalidBlockError> {
    const {index: previousIndex, hash: previousHash} = this.getLatestBlock();
    const index = previousIndex + 1;
    const timestamp = Math.floor(Date.now() / 1000);

    const hashPayload = {
      index,
      previousHash,
      timestamp,
      data,
    };

    const hash = calculateHash(hashPayload);
    const nextBlock = new Block({
      ...hashPayload,
      hash,
    });

    const addToChainResult = this.addToChain(nextBlock);
    if ('error' in addToChainResult) {
      return {ok: false, error: addToChainResult.error};
    }

    return {ok: true, value: nextBlock};
  }

  public replaceChain(blocks: Block[]) {
    if (!this.isValidChain(blocks) || blocks.length <= this.blocks.length) {
      console.log('Received blockchain is invalid');
      return;
    }

    console.log(
      'Received blockchain is valid. Replacing current blockchain with received blockchain'
    );

    this.setBlocks(blocks);
    this.broadcastChanges();
  }

  private setBlocks(blocks: Block[]) {
    this._blocks = blocks;
  }

  private appendBlock(block: Block) {
    this._blocks.push(block);
  }

  private broadcastChanges() {}

  private isValidChain(blocks: Block[]) {
    const isValidGenesisBlock =
      blocks[0].stringify === BlockChain.GENESIS_BLOCK.stringify;
    if (!isValidGenesisBlock) return false;

    for (let index = 1; index < blocks.length; index += 1) {
      const newBlock = blocks[index];
      const previousBlock = blocks[index - 1];
      if (!this.isValidNewBlock({newBlock, previousBlock})) {
        return false;
      }
    }

    return true;
  }

  private addToChain(newBlock: Block): Result<void, InvalidBlockError> {
    const previousBlock = this.getLatestBlock();

    const isValid = this.isValidNewBlock({newBlock, previousBlock});
    if (!isValid) return {ok: false, error: new InvalidBlockError()};

    this.appendBlock(newBlock);

    return {ok: true, value: undefined};
  }

  private calculateHashForBlock(block: Block) {
    return calculateHash(block.hashPayload);
  }

  private isValidNewBlock({
    newBlock,
    previousBlock,
  }: {
    newBlock: Block;
    previousBlock: Block;
  }) {
    return (
      newBlock.isValidBlockStructure &&
      previousBlock.index + 1 === newBlock.index &&
      previousBlock.hash === newBlock.previousHash &&
      newBlock.hash === this.calculateHashForBlock(newBlock)
    );
  }

  public static GENESIS_BLOCK = GENESIS_BLOCK;
}

class BlockChainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BlockChainError';
  }
}

export class InvalidBlockError extends BlockChainError {
  constructor() {
    super('Invalid block provided');
    this.name = 'InvalidBlockError';
  }
}

export default BlockChain;

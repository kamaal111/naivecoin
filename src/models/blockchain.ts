import Block from './block';

import {calculateHash} from '../utils/hashing';
import type {Result} from '../types';
import hexToBinary from '../utils/hexToBinary';

const GENESIS_BLOCK = new Block({
  index: 0,
  hash: 'cd2fb2ace926608315b2a5bd1bc2a259dce057a21ed63351adc0b1326da2a99e',
  previousHash: null,
  timestamp: 1652722519,
  data: 'The Genesis block!!!',
  difficulty: 0,
  nonce: 0,
});

// in seconds
const BLOCK_GENERATION_INTERVAL = 10;

// in blocks
const DIFFICULTY_ADJUSTMENT_INTERVAL = 10;

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

  public get latestBlock() {
    return this.blocks[this.chainLength - 1];
  }

  public generateNextBlock(data: string): Result<Block, InvalidBlockError> {
    const {index: previousIndex, hash: previousHash} = this.latestBlock;
    const index = previousIndex + 1;
    const timestamp = Math.floor(Date.now() / 1000);
    const difficulty = this.getDifficulty();

    const nextBlock = this.findBlock({
      index,
      previousHash,
      timestamp,
      data,
      difficulty,
    });

    const addToChainResult = this.addToChain(nextBlock);
    if ('error' in addToChainResult) {
      return {ok: false, error: addToChainResult.error};
    }

    return {ok: true, value: nextBlock};
  }

  public replaceChain(blocks: Block[]): Result<void, InvalidBlockChainError> {
    if (!this.isValidChain(blocks) || blocks.length <= this.blocks.length) {
      return {ok: false, error: new InvalidBlockChainError()};
    }

    console.log(
      'Received blockchain is valid. Replacing current blockchain with received blockchain'
    );

    this.setBlocks(blocks);

    return {ok: true, value: undefined};
  }

  public addToChain(newBlock: Block): Result<void, InvalidBlockError> {
    const previousBlock = this.latestBlock;

    const isValid = this.isValidNewBlock({newBlock, previousBlock});
    if (!isValid) return {ok: false, error: new InvalidBlockError()};

    this.appendBlock(newBlock);

    return {ok: true, value: undefined};
  }

  private findBlock(payload: {
    index: number;
    previousHash: string | null | undefined;
    timestamp: number;
    data: string;
    difficulty: number;
  }) {
    let nonce = 0;
    while (true) {
      const hash = calculateHash({...payload, nonce});
      if (this.hashMatchesDifficulty(hash, payload.difficulty)) {
        return new Block({...payload, hash, nonce});
      }
      nonce += 1;
    }
  }

  private hashMatchesDifficulty(hash: string, difficulty: number) {
    const hashInBinary = hexToBinary(hash);
    if (hashInBinary == null) return false;

    const requiredPrefix = '0'.repeat(difficulty);
    return hashInBinary.startsWith(requiredPrefix);
  }

  private getDifficulty() {
    if (
      this.latestBlock.index !== 0 &&
      this.latestBlock.index % DIFFICULTY_ADJUSTMENT_INTERVAL === 0
    ) {
      return this.getAdjustedDifficulty();
    }

    return this.latestBlock.difficulty;
  }

  private getAdjustedDifficulty() {
    const prevAdjustmentBlock =
      this.blocks[this.blocks.length - DIFFICULTY_ADJUSTMENT_INTERVAL];
    const timeExpected =
      BLOCK_GENERATION_INTERVAL * DIFFICULTY_ADJUSTMENT_INTERVAL;
    const timeTaken =
      this.latestBlock.timestamp - prevAdjustmentBlock.timestamp;

    if (timeTaken < timeExpected / 2) {
      return prevAdjustmentBlock.difficulty + 1;
    }

    if (timeTaken > timeExpected * 2) {
      return prevAdjustmentBlock.difficulty - 1;
    }

    return prevAdjustmentBlock.difficulty;
  }

  private setBlocks(blocks: Block[]) {
    this._blocks = blocks;
  }

  private appendBlock(block: Block) {
    this._blocks.push(block);
  }

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

export class InvalidBlockChainError extends BlockChainError {
  constructor() {
    super('Invalid block chain provided');
    this.name = 'InvalidBlockChainError';
  }
}

export default BlockChain;

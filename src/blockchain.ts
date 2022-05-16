import Block from './models/block';
import {calculateHash} from './utils/hashing';

const GENESIS_BLOCK = new Block({
  index: 0,
  hash: 'cd2fb2ace926608315b2a5bd1bc2a259dce057a21ed63351adc0b1326da2a99e',
  previousHash: null,
  timestamp: 1652722519,
  data: 'The Genesis block!!!',
});

export class BlockChain {
  private blocks: Block[];

  constructor() {
    this.blocks = [BlockChain.GENESIS_BLOCK];
  }

  public get chainLength() {
    return this.blocks.length;
  }

  public getLatestBlock() {
    return this.blocks[this.chainLength - 1];
  }

  public generateNextBlock(data: string) {
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

    this.addToChain(nextBlock);

    return nextBlock;
  }

  private addToChain(block: Block) {
    const isValid = this.isValidNewBlock(block);
    if (!isValid) return;

    this.blocks.push(block);
  }

  private calculateHashForBlock(block: Block) {
    return calculateHash(block.hashPayload);
  }

  private isValidNewBlock(block: Block) {
    const previousBlock = this.getLatestBlock();
    return (
      block.isValidBlockStructure &&
      previousBlock.index + 1 === block.index &&
      previousBlock.hash === block.previousHash &&
      block.hash === this.calculateHashForBlock(block)
    );
  }

  public static GENESIS_BLOCK = GENESIS_BLOCK;
}

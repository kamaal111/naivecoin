export class Block {
  public index: number;
  public hash: string;
  public previousHash?: string | null;
  public timestamp: number;
  public data: string;

  constructor({
    index,
    hash,
    previousHash,
    timestamp,
    data,
  }: {
    index: number;
    hash: string;
    previousHash: string | null;
    timestamp: number;
    data: string;
  }) {
    this.index = index;
    this.previousHash = previousHash;
    this.timestamp = timestamp;
    this.data = data;
    this.hash = hash;

    Object.freeze(this);
  }
}

export default Block;

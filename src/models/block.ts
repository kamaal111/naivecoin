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

  public get stringify() {
    return JSON.stringify(this);
  }

  public get hashPayload() {
    return {
      index: this.index,
      previousHash: this.previousHash,
      timestamp: this.timestamp,
      data: this.data,
    };
  }

  public get isValidBlockStructure() {
    return (
      typeof this.index === 'number' &&
      typeof this.hash === 'string' &&
      (typeof this.previousHash === 'string' || this.previousHash == null) &&
      typeof this.timestamp === 'number' &&
      typeof this.data === 'string'
    );
  }
}

export default Block;

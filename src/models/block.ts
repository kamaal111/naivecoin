export class Block {
  public index: number;
  public hash: string;
  public previousHash?: string | null | undefined;
  public timestamp: number;
  public data: string;
  public difficulty: number;
  public nonce: number;

  constructor({
    index,
    hash,
    previousHash,
    timestamp,
    data,
    difficulty,
    nonce,
  }: {
    index: number;
    hash: string;
    previousHash: string | null | undefined;
    timestamp: number;
    data: string;
    difficulty: number;
    nonce: number;
  }) {
    this.index = index;
    this.previousHash = previousHash;
    this.timestamp = timestamp;
    this.data = data;
    this.hash = hash;
    this.difficulty = difficulty;
    this.nonce = nonce;

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
      difficulty: this.difficulty,
      nonce: this.nonce,
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

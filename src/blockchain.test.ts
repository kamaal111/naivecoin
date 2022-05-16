import {GENESIS_BLOCK} from './blockchain';
import {calculateHash} from './utils/hashing';

test('genesis block is hashed correctly', () => {
  expect(calculateHash(GENESIS_BLOCK.hashPayload)).toEqual(GENESIS_BLOCK.hash);
});

import {SHA256} from 'crypto-js';

export const calculateHash = ({
  index,
  previousHash,
  timestamp,
  data,
  difficulty,
  nonce,
}: {
  index: number;
  previousHash: string | null | undefined;
  timestamp: number;
  data: string;
  difficulty: number;
  nonce: number;
}): string => {
  const message = `${index}${
    previousHash ?? ''
  }${timestamp}${data}${difficulty}${nonce}`;
  const hash = SHA256(message);
  return hash.toString();
};

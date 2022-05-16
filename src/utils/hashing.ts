import {SHA256} from 'crypto-js';

export const calculateHash = ({
  index,
  previousHash,
  timestamp,
  data,
}: {
  index: number;
  previousHash: string | null | undefined;
  timestamp: number;
  data: string;
}): string => {
  const message = `${index}${previousHash ?? ''}${timestamp}${data}`;
  const hash = SHA256(message);
  return hash.toString();
};

import type {Router} from 'express';

import type BlockChain from './blockchain';

export type Context = {
  blockChain: BlockChain;
};

export type Controller = {
  router: Router;
  path: string;
};

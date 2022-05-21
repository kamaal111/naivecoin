import type {Request, Router} from 'express';

import type BlockChain from './blockchain';

export type Context = {
  blockChain: BlockChain;
};

export type AppRequest = Request & {context?: Context};

export type Controller = {
  router: Router;
  path: string;
};

import type {Request, Router} from 'express';

import type BlockChain from './blockchain';

export type Context = {
  blockChain: BlockChain;
};

export type AppRequest<
  Params = Record<string, unknown>,
  ResponseBody = Record<string, unknown>,
  RequestBody = Record<string, unknown>,
  RequestQuery = qs.ParsedQs
> = Request<Params, ResponseBody, RequestBody, RequestQuery> & {
  context?: Context;
};

export type Controller = {
  router: Router;
  path: string;
};

export type Result<T, E = Error> = {ok: true; value: T} | {ok: false; error: E};

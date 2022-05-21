import type {NextFunction, Response} from 'express';

import sendError from '../utils/sendError';
import type {AppRequest} from '../types';

function checkBlockChainMiddleware(
  request: AppRequest,
  response: Response,
  next: NextFunction
) {
  const blockChain = request.context?.blockChain;
  if (blockChain == null) {
    sendError(response, next)(500);
    return;
  }

  next();
}

export default checkBlockChainMiddleware;

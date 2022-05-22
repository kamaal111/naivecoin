import type {NextFunction, Response} from 'express';

import sendError from '../utils/sendError';
import type {AppRequest, Context} from '../types';

function checkContextMiddleware(...fields: (keyof Context)[]) {
  return function (
    request: AppRequest,
    response: Response,
    next: NextFunction
  ) {
    const context = request.context;
    for (const field of fields) {
      if ((context ?? {})[field] == null) {
        sendError(response, next)(500);
        return;
      }
    }

    next();
  };
}

export default checkContextMiddleware;

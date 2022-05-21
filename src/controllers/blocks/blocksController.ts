import {Router} from 'express';
import type {NextFunction, Response} from 'express';

import sendError from '../../utils/sendError';
import checkBlockChainMiddleware from '../../middleware/checkBlockChainMiddleware';
import type {AppRequest, Controller} from '../../types';

class BlocksController implements Controller {
  public path = '/blocks';
  public router = Router();

  constructor() {
    this.initializeMiddleware();
    this.initializeRoutes();
  }

  private initializeMiddleware() {
    this.router.use(checkBlockChainMiddleware);
  }

  private initializeRoutes() {
    this.router.get('/', this.getBlocks);
    this.router.post('/', this.mineBlock);
  }

  private getBlocks(request: AppRequest, response: Response) {
    const blocks = request.context!.blockChain.blocks;
    response.json(blocks);
  }

  private mineBlock(
    request: AppRequest<undefined, undefined, {data?: unknown} | undefined>,
    response: Response,
    next: NextFunction
  ) {
    const blockChain = request.context!.blockChain;

    const data = request.body?.data;
    if (typeof data !== 'string') {
      sendError(response, next)(400);
      return;
    }

    const generateNextBlockResult = blockChain.generateNextBlock(data);
    if ('error' in generateNextBlockResult) {
      sendError(response, next)(400);
      return;
    }

    response.json({data});
  }
}

export default BlocksController;

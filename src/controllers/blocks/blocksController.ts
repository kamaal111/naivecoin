import {Router} from 'express';
import type {NextFunction, Response} from 'express';

import {InvalidBlockError} from '../../blockchain';

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
    request: AppRequest,
    response: Response,
    next: NextFunction
  ) {
    const blockChain = request.context!.blockChain;

    try {
      blockChain.generateNextBlock(request.body.data);
    } catch (error) {
      if (error instanceof InvalidBlockError) {
        sendError(response, next)(400);
        return;
      }

      sendError(response, next)(500);
      return;
    }

    response.send('mine');
  }
}

export default BlocksController;

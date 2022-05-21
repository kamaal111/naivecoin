import {Router} from 'express';
import type {NextFunction, Response} from 'express';

import sendError from '../../utils/sendError';
import type {AppRequest, Controller} from '../../types';

class BlocksController implements Controller {
  public path = '/blocks';
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get('/', this.getBlocks);
    this.router.post('/', this.mineBlock);
  }

  private getBlocks(
    request: AppRequest,
    response: Response,
    next: NextFunction
  ) {
    const blockChain = request.context?.blockChain.blocks;
    if (blockChain == null) {
      sendError(response, next)(500);
      return;
    }

    response.json(blockChain);
  }

  private mineBlock(_request: AppRequest, response: Response) {
    response.send('mine');
  }
}

export default BlocksController;

import {Router} from 'express';
import type {Response} from 'express';

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

  private getBlocks(request: AppRequest, response: Response) {
    const blockChain = request.context?.blockChain.encodedObject();
    if (blockChain == null) {
      response.status(500);
      response.json({details: 'Okey we messed up, please help!'});
      return;
    }

    response.json(blockChain);
  }

  private mineBlock(_request: AppRequest, response: Response) {
    response.send('mine');
  }
}

export default BlocksController;

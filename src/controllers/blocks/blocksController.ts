import {Router} from 'express';
import type {Request, Response} from 'express';

class BlocksController {
  public path = '/blocks';
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get('/', this.getBlocks);
    this.router.post('/', this.mineBlock);
  }

  getBlocks(_request: Request, response: Response) {
    response.send('blocks');
  }

  mineBlock(_request: Request, response: Response) {
    response.send('mine');
  }
}

export default BlocksController;

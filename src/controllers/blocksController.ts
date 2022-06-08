import {Router} from 'express';
import type {NextFunction, Response} from 'express';

import sendError from '../utils/sendError';
import checkContextMiddleware from '../middleware/checkContextMiddleware';
import type {AppRequest, Controller} from '../types';
import type BlockChain from '../models/blockchain';
import type PeerToPeer from '../models/peerToPeer';

type MineBlockPayload = {data?: unknown} | undefined;

class BlocksController implements Controller {
  public path = '/blocks';
  public router = Router();

  constructor() {
    this.initializeMiddleware();
    this.initializeRoutes();
  }

  private initializeMiddleware() {
    this.router.use(checkContextMiddleware('blockChain', 'peerToPeer'));
  }

  private initializeRoutes() {
    this.router.get('/', this.getBlocks);
    this.router.post('/', this.mineBlock);
  }

  private getBlocks(request: AppRequest, response: Response) {
    const blocks = request.context!.blockChain.blocks;
    response.json(blocks);
  }

  private async mineBlock(
    request: AppRequest<undefined, undefined, MineBlockPayload>,
    response: Response,
    next: NextFunction
  ) {
    const data = request.body?.data;
    if (typeof data !== 'string') {
      sendError(response, next)(400);
      return;
    }

    const blockChain = request.context!.blockChain;
    const peerToPeer = request.context!.peerToPeer;
    this.generateAndBroadcastNextBlock({blockChain, peerToPeer, data});

    response.status(204).send();
  }

  private async generateAndBroadcastNextBlock({
    blockChain,
    peerToPeer,
    data,
  }: {
    blockChain: BlockChain;
    peerToPeer: PeerToPeer;
    data: string;
  }) {
    const generateNextBlockResult = await blockChain.generateNextBlock(data);
    if ('error' in generateNextBlockResult) {
      console.log(
        'error while generating next block; error:',
        generateNextBlockResult.error
      );
      return;
    }

    peerToPeer.blockChain = blockChain;
    peerToPeer.broadcastLatestBlock();
  }
}

export default BlocksController;

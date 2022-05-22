import {Router} from 'express';
import type {NextFunction, Response} from 'express';

import sendError from '../utils/sendError';
import checkContextMiddleware from '../middleware/checkContextMiddleware';
import type {AppRequest, Controller} from '../types';

type AddPeerPayload = {peer?: unknown} | undefined;

class PeersController implements Controller {
  public path = '/peers';
  public router = Router();

  constructor() {
    this.initializeMiddleware();
    this.initializeRoutes();
  }

  private initializeMiddleware() {
    this.router.use(checkContextMiddleware('peerToPeer', 'blockChain'));
  }

  private initializeRoutes() {
    this.router.get('/', this.getPeers);
    this.router.post('/', this.addPeer);
  }

  private getPeers(request: AppRequest, response: Response) {
    const socketAddresses = request.context!.peerToPeer.socketAddresses;
    response.send(socketAddresses);
  }

  private addPeer(
    request: AppRequest<undefined, undefined, AddPeerPayload>,
    response: Response,
    next: NextFunction
  ) {
    const peer = request.body?.peer;
    if (typeof peer !== 'string') {
      sendError(response, next)(400);
      return;
    }

    const peerToPeer = request.context!.peerToPeer;
    peerToPeer.blockChain = request.context!.blockChain;
    peerToPeer.connectToPeer(peer);

    response.status(204).send();
  }
}

export default PeersController;

import {Router} from 'express';
import type {NextFunction, Response} from 'express';

import sendError from '../utils/sendError';
import checkContextMiddleware from '../middleware/checkContextMiddleware';
import type {AppRequest, Controller} from '../types';

type AddPeerPayload = {} | undefined;

class PeersController implements Controller {
  public path = '/peers';
  public router = Router();

  constructor() {
    this.initializeMiddleware();
    this.initializeRoutes();
  }

  private initializeMiddleware() {
    this.router.use(checkContextMiddleware('peerToPeer'));
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
    response: Response
  ) {
    response.send('add peer');
  }
}

export default PeersController;

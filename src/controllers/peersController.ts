import {Router} from 'express';
import type {NextFunction, Response} from 'express';

import sendError from '../utils/sendError';
import type {AppRequest, Controller} from '../types';

type AddPeerPayload = {} | undefined;

class PeersController implements Controller {
  public path = '/peers';
  public router = Router();

  constructor() {
    this.initializeMiddleware();
    this.initializeRoutes();
  }

  private initializeMiddleware() {}

  private initializeRoutes() {
    this.router.get('/', this.getPeers);
    this.router.post('/', this.addPeer);
  }

  private getPeers(
    request: AppRequest,
    response: Response,
    next: NextFunction
  ) {
    const socketAddresses = request.context?.peerToPeer.socketAddresses;
    if (socketAddresses == null) {
      sendError(response, next)(500);
      return;
    }

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

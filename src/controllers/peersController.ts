import {Router} from 'express';
import type {Controller} from '../types';

class PeersController implements Controller {
  path = '/peers';
  router = Router();

  constructor() {
    this.initializeMiddleware();
    this.initializeRoutes();
  }

  private initializeMiddleware() {}

  private initializeRoutes() {}
}

export default PeersController;

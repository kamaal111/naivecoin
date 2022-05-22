import * as express from 'express';
import * as logger from 'morgan';

import BlockChain from '../models/blockchain';

import contextMiddleware from '../middleware/contextMiddleware';
import type {AppRequest, Context, Controller} from '../types';

const blockChain = new BlockChain();

const context: Context = {
  blockChain,
};

class App {
  public app = express();
  public port: string;

  constructor({port, controllers}: {port: string; controllers: Controller[]}) {
    this.port = port;

    this.initializeMiddleware();
    this.initializeRoutes(controllers);
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`listening on port ${this.port}`);
    });
  }

  private initializeMiddleware() {
    this.app.use(logger('dev'));
    this.app.use(express.json());
    this.app.use(contextMiddleware(context));
  }

  private initializeRoutes(controllers: Controller[]) {
    this.app.get('/', (_request, response) => {
      response.json({hello: 'world'});
    });

    this.initializeControllers(controllers);

    this.app.use(this.errorHandler);

    this.app.use((_request, response) => {
      response.status(404).json({details: 'Not Found'});
    });
  }

  private initializeControllers(controllers: Controller[]) {
    for (const controller of controllers) {
      this.app.use(controller.path, controller.router);
    }
  }

  private errorHandler(
    _request: AppRequest,
    response: express.Response,
    next: express.NextFunction
  ) {
    const statusCode = response.statusCode;
    if (statusCode === 404) {
      next();
      return;
    }

    let message: string | undefined;
    switch (statusCode) {
      case 400:
        message = 'Bad Request';
        break;
    }

    response
      .status(statusCode)
      .json({details: message ?? 'Okey we messed up, please help!'});
  }
}

export default App;

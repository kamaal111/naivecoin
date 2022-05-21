import App from './controllers/app';
import BlocksController from './controllers/blocks/blocksController';

import config from './config';

const blocksController = new BlocksController();
const controllers = [blocksController];

const app = new App({port: config.PORT, controllers});
app.listen();

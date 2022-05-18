import * as express from 'express';
import * as logger from 'morgan';

import blocksRoute from './routes/blocks';
import notFound from './controllers/notFound';
import root from './controllers/root';

import config from './config';

const app = express();

app.use(logger('dev'));
app.use(express.json());

app.get('/', root);
app.use('/blocks', blocksRoute);
app.use(notFound);

app.listen(config.PORT, () => {
  console.log(`listening on port ${config.PORT}`);
});

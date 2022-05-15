import * as express from 'express';

import config from './config';

const app = express();

app.get('/', (_req, res) => {
  res.send('Hello World!');
});

app.listen(config.PORT, () => {
  console.log(`listening on port ${config.PORT}`);
});

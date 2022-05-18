import {RouterParams} from '../../types';

function getBlocks({res}: RouterParams<'get'>) {
  res.send('blocks');
}

export default getBlocks;

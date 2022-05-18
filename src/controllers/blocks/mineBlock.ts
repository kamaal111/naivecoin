import {RouterParams} from '../../types';

function mineBlock({res}: RouterParams<'post'>) {
  res.send('mine');
}

export default mineBlock;

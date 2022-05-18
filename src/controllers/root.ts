import {RouterParams} from '../types';

function root({res}: RouterParams<'get'>) {
  res.json({hello: 'world'});
}

export default root;

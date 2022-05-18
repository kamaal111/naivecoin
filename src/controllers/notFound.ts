import {RouterParams} from '../types';

function notFound({res}: RouterParams<'get'>) {
  res.status(404);
  res.json({details: 'Not Found'});
}

export default notFound;

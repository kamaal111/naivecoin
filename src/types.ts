import type {Router as _Router, Response, Request, NextFunction} from 'express';

type Router = ReturnType<typeof _Router>;
type RouterActions = {
  res: Response;
  req: Request;
  next: NextFunction;
};
export type RouterParams<T extends 'get' | 'post'> = Parameters<Router[T]>[1] &
  RouterActions;

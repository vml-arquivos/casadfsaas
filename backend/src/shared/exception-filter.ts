import { Request, Response, NextFunction } from 'express';
import logger from './logger';

export function exceptionFilter(err: any, req: Request, res: Response, next: NextFunction) {
  logger.error(err);
  if (res.headersSent) {
    return next(err);
  }
  res.status(err.status || 500).json({
    message: err.message || 'Erro interno do servidor',
    status: err.status || 500,
  });
}

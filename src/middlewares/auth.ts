import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler';
import { config } from '../config';

declare global {
  namespace Express {
    interface Request {
      usuario: {
        id: string;
      };
    }
  }
}

export const autenticar = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(new AppError('Token não fornecido', 401));
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2) {
    return next(new AppError('Token mal formatado', 401));
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return next(new AppError('Token mal formatado', 401));
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as { id: string };
    
    req.usuario = {
      id: decoded.id,
    };

    return next();
  } catch (error) {
    return next(new AppError('Token inválido', 401));
  }
};

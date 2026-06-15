import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export const validate = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const issues = (error as any).issues || (error as any).errors || [];
        const erros = issues.map((err: any) => ({
          campo: err.path.join('.'),
          mensagem: err.message,
        }));

        res.status(422).json({
          erro: 'Dados inválidos',
          detalhes: erros,
        });
        return;
      }
      next(error);
    }
  };
};

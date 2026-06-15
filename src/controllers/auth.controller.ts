import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma/client';
import { AppError } from '../middlewares/errorHandler';
import { config } from '../config';

export class AuthController {
  async registrar(req: Request, res: Response, next: NextFunction) {
    try {
      const { nome, email, senha } = req.body;

      const usuarioExiste = await prisma.usuario.findUnique({
        where: { email },
      });

      if (usuarioExiste) {
        throw new AppError('Este e-mail já está em uso', 409);
      }

      const saltRounds = 10;
      const senhaHash = await bcrypt.hash(senha, saltRounds);

      const novoUsuario = await prisma.usuario.create({
        data: {
          nome,
          email,
          senha: senhaHash,
        },
      });

      const token = jwt.sign(
        { id: novoUsuario.id },
        config.jwtSecret,
        { expiresIn: config.jwtExpiresIn as any }
      );

      const refreshToken = jwt.sign(
        { id: novoUsuario.id },
        config.jwtRefreshSecret,
        { expiresIn: config.jwtRefreshExpiresIn as any }
      );

      await prisma.usuario.update({
        where: { id: novoUsuario.id },
        data: { refreshToken },
      });

      const { senha: _, refreshToken: __, ...usuarioSemSenha } = novoUsuario;

      res.status(201).json({
        usuario: usuarioSemSenha,
        token,
        refreshToken,
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, senha } = req.body;

      const usuario = await prisma.usuario.findUnique({
        where: { email },
      });

      if (!usuario) {
        throw new AppError('E-mail ou senha inválidos', 401);
      }

      const senhaValida = await bcrypt.compare(senha, usuario.senha);

      if (!senhaValida) {
        throw new AppError('E-mail ou senha inválidos', 401);
      }

      const token = jwt.sign(
        { id: usuario.id },
        config.jwtSecret,
        { expiresIn: config.jwtExpiresIn as any }
      );

      const refreshToken = jwt.sign(
        { id: usuario.id },
        config.jwtRefreshSecret,
        { expiresIn: config.jwtRefreshExpiresIn as any }
      );

      await prisma.usuario.update({
        where: { id: usuario.id },
        data: { refreshToken },
      });

      const { senha: _, refreshToken: __, ...usuarioSemSenha } = usuario;

      res.json({
        usuario: usuarioSemSenha,
        token,
        refreshToken,
      });
    } catch (error) {
      next(error);
    }
  }

  async perfil(req: Request, res: Response, next: NextFunction) {
    try {
      const idUsuario = req.usuario.id;

      const usuario = await prisma.usuario.findUnique({
        where: { id: idUsuario },
      });

      if (!usuario) {
        throw new AppError('Usuário não encontrado', 404);
      }

      const { senha: _, refreshToken: __, ...usuarioSemSenha } = usuario;

      res.json(usuarioSemSenha);
    } catch (error) {
      next(error);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        throw new AppError('Token de refresh não fornecido', 401);
      }

      let payload;
      try {
        payload = jwt.verify(refreshToken, config.jwtRefreshSecret) as { id: string };
      } catch (err) {
        throw new AppError('Token de refresh inválido', 401);
      }

      const usuario = await prisma.usuario.findUnique({
        where: { id: payload.id },
      });

      if (!usuario || usuario.refreshToken !== refreshToken) {
        throw new AppError('Token de refresh inválido ou revogado', 401);
      }

      const newToken = jwt.sign(
        { id: usuario.id },
        config.jwtSecret,
        { expiresIn: config.jwtExpiresIn as any }
      );

      const newRefreshToken = jwt.sign(
        { id: usuario.id },
        config.jwtRefreshSecret,
        { expiresIn: config.jwtRefreshExpiresIn as any }
      );

      await prisma.usuario.update({
        where: { id: usuario.id },
        data: { refreshToken: newRefreshToken },
      });

      res.json({
        token: newToken,
        refreshToken: newRefreshToken,
      });
    } catch (error) {
      next(error);
    }
  }
}

import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../middlewares/validate';
import { autenticar } from '../middlewares/auth';
import { registroSchema, loginSchema, refreshSchema } from '../schemas/auth.schema';

const authRouter = Router();
const authController = new AuthController();

authRouter.post('/registro', validate(registroSchema), authController.registrar.bind(authController));
authRouter.post('/login', validate(loginSchema), authController.login.bind(authController));
authRouter.post('/refresh', validate(refreshSchema), authController.refresh.bind(authController));
authRouter.get('/me', autenticar, authController.perfil.bind(authController));

export { authRouter };

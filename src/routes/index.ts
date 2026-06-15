import { Router } from "express";
import { produtoRouter } from "./produto.routes";
import { categoriaRouter } from "./categoria.routes";
import { authRouter } from "./auth.routes";

const router = Router();

// Prefixo + router específico
router.use("/auth", authRouter);
router.use("/produtos", produtoRouter);
router.use("/categorias", categoriaRouter);

// Adicione novas rotas aqui:
// import { usuarioRouter } from "./usuario.routes";
// router.use("/usuarios", usuarioRouter);

export { router };
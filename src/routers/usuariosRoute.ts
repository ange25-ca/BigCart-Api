//usuariosRoute.js

import { Router } from "express";
import { loginUsuario, verUsuarios } from "../controller/usuariosController";

const router: Router = Router();

router.get('/', verUsuarios);
router.post('/login', loginUsuario);

export default router;
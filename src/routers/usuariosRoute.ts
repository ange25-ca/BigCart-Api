import { Router } from "express";
import { verUsuarios } from "../controller/usuariosController";
import exp from "constants";

const router: Router = Router();

router.get('/usuarios', verUsuarios);

export default router;
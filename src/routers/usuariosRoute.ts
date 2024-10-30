//usuariosRoute.js

import { Router } from "express";
import { loginUsuario, verUsuarios } from "../controller/usuariosController";

const router: Router = Router();

router.get('/', (req, res) => {
    res.send('Bienvenido a la API');
});

// Ruta para loginUsuario
router.post('/loginUsuario', (req, res, next) => {
    console.log('Datos de la solicitud de login:', req.body); // Agrega esto para ver el cuerpo de la solicitud
    loginUsuario(req, res).catch(next); // Manejo de errores con next
});


router.get('/verUsuarios', verUsuarios); // Usa la función verUsuarios

export default router;
//usuariosRoute.js
import { Router } from "express";
import { loginUsuario, SignUpNewUser, verUsuarios } from "../controller/usuariosController";
import { decryptMiddleware } from "../middleware/decrypt";

const router: Router = Router();

router.get('/', (req, res) => {
    res.send('Bienvenido a la API');
});

// Ruta para loginUsuario
router.post('/loginUsuario', decryptMiddleware, loginUsuario);
// Ruta para SignUp
router.post('/signUpUsuario', SignUpNewUser);
router.get('/verUsuarios', verUsuarios); // Usa la función verUsuarios

export default router;
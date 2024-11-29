//usuariosRoute.js
import { Router } from "express";
import { loginUsuario, obtenerDatosUsuario, SignUpNewUser, verUsuarios } from "../controller/usuariosController";
import { decryptMiddleware } from "../middleware/decrypt";
import verifyMiddleware from "../middleware/verifyMiddleware";

const router: Router = Router();

router.get('/', (req, res) => {
    res.send('Bienvenido a la API');
});

// Ruta para loginUsuario
router.post('/loginUsuario', loginUsuario);
// Ruta para SignUp
router.post('/signUpUsuario', SignUpNewUser);
// Ruta protegida para obtener datos del usuario autenticado
router.get('/obtenerDatosUsuario', verifyMiddleware, obtenerDatosUsuario),
router.get('/verUsuarios', verUsuarios); // Usa la función verUsuarios

export default router;
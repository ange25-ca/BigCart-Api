//usuariosRoute.js
import { Router } from "express";
import { actualizarPerfil, loginUsuario, obtenerDatosUsuario, SignUpNewUser, verUsuarios } from "../controller/usuariosController";
import { decryptMiddleware } from "../middleware/decrypt";
import verifyMiddleware from "../middleware/verifyMiddleware";
import upload from "../middleware/imageMiddleware";

const router: Router = Router();

router.get('/', (req, res) => {
    res.send('Bienvenido a la API');
});

// Ruta para loginUsuario
router.post('/loginUsuario', loginUsuario);
// Ruta para SignUp
router.post('/signUpUsuario', SignUpNewUser);
// Ruta protegida para obtener datos del usuario autenticado
router.get('/obtenerDatosUsuario', verifyMiddleware, obtenerDatosUsuario);
// Ruta para la actualización de datos (por ahora solo se esta mandando la imagen de perfil)
router.put('/updateDataUser/:idUsuario', upload.single('profileImage'), actualizarPerfil);

router.get('/verUsuarios', verUsuarios); // Usa la función verUsuarios

export default router;
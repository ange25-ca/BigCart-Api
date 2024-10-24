import { Router } from 'express';
import usuariosRoute from './usuariosRoute';


const router: Router = Router();

// Rutas específicas para usuarios
router.use('/usuarios', usuariosRoute);


export default router;

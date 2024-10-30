import { Router } from 'express';
import usuariosRoute from './usuariosRoute';


const router: Router = Router();

// Rutas específicas para usuarios
router.use('/user', usuariosRoute);


export default router;

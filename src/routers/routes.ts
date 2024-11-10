import { Router } from 'express';
import usuariosRoute from './usuariosRoute';
import  ProductosRoute  from './productosRoute';


const router: Router = Router();

// Rutas específicas para usuarios
router.use('/user', usuariosRoute);
//rutas para los productos
router.use('/productos', ProductosRoute);


export default router;

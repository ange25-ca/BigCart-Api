import { Router } from 'express';
import usuariosRoute from './usuariosRoute';
import  ProductosRoute  from './productosRoute';
import carritoRoute from './carritoRoute';

const router: Router = Router();

// Rutas específicas para usuarios
router.use('/user', usuariosRoute);
//rutas para los productos
router.use('/productos', ProductosRoute);
//rutas para el carrito
 router.use('/carrito', carritoRoute);

export default router;

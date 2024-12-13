import { Router } from "express";
import { addToCart, eliminarXProducto, updateCartQuantity, viewAllCartProductos,vaciarCart } from "../controller/carritoController";
const router: Router = Router();
router.post('/addCart', addToCart);
router.get('/viewCart/:idCart',viewAllCartProductos );
router.put('/updatequantity', updateCartQuantity)
router.delete('/eliminarProducto', eliminarXProducto);
router.put('/vaciarCarrito', vaciarCart)
export default router;


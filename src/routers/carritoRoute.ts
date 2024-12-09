import { Router } from "express";
import { addToCart, eliminarXProducto, updateCartQuantity, viewAllCartProductos } from "../controller/carritoController";
const router: Router = Router();
router.post('/addCart', addToCart);
router.get('/viewCart/:idCart',viewAllCartProductos );
router.put('/updatequantity', updateCartQuantity)
router.delete('/eliminarProducto', eliminarXProducto);
export default router;


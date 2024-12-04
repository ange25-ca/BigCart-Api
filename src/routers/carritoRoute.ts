import { Router } from "express";
import { addToCart, updateCartQuantity, viewAllCartProductos } from "../controller/carritoController";
const router: Router = Router();
router.post('/addCart', addToCart);
router.get('/viewCart/:idCart',viewAllCartProductos );
router.put('/updatequantity', updateCartQuantity)
export default router;


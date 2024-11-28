 import { Router } from "express";
 import { addToCart, viewAllCartProductos } from "../controller/carritoController";
 const router: Router = Router();
 router.post('/addCart', addToCart);
 router.get('/viewCart/:idCart',viewAllCartProductos );
 export default router;
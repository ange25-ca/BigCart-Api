 import { Router } from "express";
 import { addToCart } from "../controller/carritoController";
 const router: Router = Router();
 router.post('/addCart', addToCart);
 export default router;
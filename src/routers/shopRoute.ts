import { Router } from "express";
import { viewAllShopProductos } from "../controller/shopController";

const router: Router = Router();
router.get('/:idCliente',viewAllShopProductos );

export default router;
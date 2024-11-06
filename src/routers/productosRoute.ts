// aqui se van a crear las rutas de los productos
import { Router } from "express";
import {verProductos, getProduct} from "../controller/productoController";

const router: Router = Router();

router.get('/', verProductos);
router.get('/:id', getProduct);

export default router;
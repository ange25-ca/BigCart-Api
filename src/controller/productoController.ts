import { Request, Response } from 'express';
import {obtenerProductos, obtenerPorId, getForCategoria} from '../services/productosServices'


interface producto{
    id: number,
}
interface ProductoResponse {
    idProducto: number; // ID del producto, coincidente con la tabla
    sku: string; // Código SKU del producto
    nombreProducto: string; // Nombre del producto
    precio: number; // Precio del producto
    descripcion: string; // Descripción del producto
    imagenUrl?: string; // URL de la imagen (puede ser opcional si aún no está disponible)
    stock: number; // Cantidad en inventario
    idCategoria: number; // ID de la categoría (clave foránea)
}


async function verProductos(req: Request, res: Response): Promise<void>{
    try {
        const productos = await obtenerProductos();
        res.json(productos);
        } catch (error) {
            res.status(500).json({error: 'Error al obtener productos'});
            }
};

async function getProduct(req:  Request, res: Response): Promise<void>{
    try {
        const id = parseInt(req.params.id, 10);
        const producto: ProductoResponse = await obtenerPorId(id);
        console.log(producto);
        if (!producto) {
            res.status(404).json({error: 'Producto no encontrado'});
            }
            res.json(producto);
    } catch (error) {
        res.status(500).json({error: 'Error al obtener producto'});
    
    }
        
}

async function buscarPorCategoria(req: Request, res: Response): Promise<void> {
    try{
        const categoria = parseInt(req.params.categoria, 10);
        console.log('categoria en modelo:' + categoria);
        if (isNaN(categoria)) {
            res.status(400).json({ error: 'El parámetro "categoria" debe ser un número válido' });
            return; // Terminamos la ejecución aquí si hay error
        }
        const productos = await getForCategoria(categoria);
        if(!productos){
            res.status(404).json({error: 'No hay productos en esta categoría'});
        }
        res.json(productos);
    } catch(error){
        res.status(500).json({error: 'Error al obtener productos de la categoría'});
    }
}

async function updateStokc() {
    
}

export{
    verProductos,
    getProduct,
    buscarPorCategoria
}
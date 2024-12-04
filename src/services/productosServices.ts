import { allProductos, obtenerProductoPorId, buscarPorCategoria, getProductStock } from "../models/productoModel";
interface ProductoResponse {
    idProducto: number; // ID del producto, coincidente con la tabla
    sku: string; // Código SKU del producto
    nombreProducto: string; // Nombre del producto
    precio: number; // Precio del producto
    descripcion: string; // Descripción del producto
    rating:  number; //calif
    imagenUrl?: string; // URL de la imagen (puede ser opcional si aún no está disponible)
    stock: number; // Cantidad en inventario
    idCategoria: number; // ID de la categoría (clave foránea)
}


export async function obtenerProductos(): Promise<any> {
    try {
        const productos = await allProductos();
        return productos;
    } catch (error) {
        return error;
    }
}


export async function obtenerPorId(id : number): Promise<any> {
    try {
        const Producto: ProductoResponse = await obtenerProductoPorId(id);
        return Producto;
    } catch (error) {
        console.log("Error al obtener el producto selecionado")
    }
}


export async function getForCategoria(categoria: number): Promise<any> {
    try {
        console.log('categoria en servicio:' + categoria);
        const Productos = await buscarPorCategoria(categoria);
        return Productos;
    } catch (error) {
        console.log('Error al obtener productos por categoria')
        throw Error;
    }
}


// Obtener el stock de un producto
export async function getStock(idProducto: number): Promise<number> {
    try {
        const stock = await getProductStock(idProducto);
        return stock;
   
    } catch (error) {
        console.log('Error al obtener stock');
        throw error;
    }
}
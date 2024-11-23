// vamos a crear las conexiones y logica para poder agregar un producto al carrito
import { PoolConnection, RowDataPacket } from "mysql2/promise";
import { obtenerConexion } from "../databases/conexion";

interface carrito extends RowDataPacket {
    id: number,
}
//creamos una funcion para obtener el estado del carrito 
export async function agregarProductoAlCarrito(idCliente: number, idProducto: number, cantidad: number): Promise<void> {
    const conexion: PoolConnection = await obtenerConexion();
    try {
        // Llama al procedimiento almacenado pasando los parámetros necesarios
        await conexion.query("CALL agregarProductoCarrito(?, ?, ?)", [idCliente, idProducto, cantidad]);
    } catch (error) {
        console.error("Error al agregar producto al carrito", error);
        throw error;
    } finally {
        conexion.release();
    }
}

export async function allCartProducts(idCarrito: number): Promise<any> {
    const conexion: PoolConnection = await obtenerConexion();
    // creamos un query para poder acceder al carrito 
    try {
        
        const [cart] = await conexion.query(`SELECT * FROM viewCart WHERE idCarrito = ?`, [idCarrito]);
        return cart;
    }
    catch(error) {
        console.error("Error al obtener los productos del carrito", error);
        throw error;
    } finally{
        conexion.release();
    }
}


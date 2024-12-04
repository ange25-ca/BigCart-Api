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
       
        const [cart] = await conexion.query(`SELECT * FROM viewCart WHERE idCliente = ? AND estadoCarrito = 'activo'`, [idCarrito]);
        return cart;
    }
    catch(error) {
        console.error("Error al obtener los productos del carrito", error);
        throw error;
    } finally{
        conexion.release();
    }
}


export async function updateAddProductCart(cantidad: number,  idCarrito: number, idproduct: number) {
    const conexion: PoolConnection = await obtenerConexion();
    try {
        // sql para poder actualizar la cantidad del producto
        await conexion.query('UPDATE carritoProducto SET Cantidad = Cantidad + ? WHERE idCarrito = ? AND idProducto = ?',[cantidad, idCarrito, idproduct]);


    } catch (error) {
        console.error("Error al actualizar la cantidad del producto en el carrito", error);
        throw error;
    } finally {
        conexion.release();
    }
}


// Obtener cantidad actual de un producto en el carrito
export async function getCurrentQuantityInCart(idCarrito: number, idProducto: number): Promise<number> {
    const conexion: PoolConnection = await obtenerConexion();  // Suponiendo que tienes un método `executeQuery` para hacer consultas SQL
      const [result]: any = await conexion.query('SELECT Cantidad FROM carritoProducto WHERE idCarrito = ? AND idProducto = ?', [idCarrito, idProducto]);
   
      // Si no hay ningún producto en el carrito, devolvemos 0
      return result.length > 0 ? result[0].Cantidad : 0;
    }
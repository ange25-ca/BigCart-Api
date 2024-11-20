// vamos a crear las conexiones y logica para poder agregar un producto al carrito
import { PoolConnection, RowDataPacket } from "mysql2/promise";
import { obtenerConexion } from "../databases/conexion";

interface carrito extends RowDataPacket{
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
  


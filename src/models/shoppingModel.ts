import { PoolConnection, RowDataPacket } from "mysql2/promise";
import { obtenerConexion } from "../databases/conexion";


export async function shoppingview(idCliente: number): Promise<any> {
    const conexion: PoolConnection = await obtenerConexion();
    // creamos un query para poder acceder al carrito
    try {
       
        const [shop] = await conexion.query(`SELECT * FROM viewshopping WHERE idCliente = ?`, [idCliente]);
        return shop;
    }
    catch(error) {
        console.error("Error al obtener la vista de compra", error);
        throw error;
    } finally{
        conexion.release();
    }
}
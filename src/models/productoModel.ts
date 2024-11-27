// creamos el modelo donde consumiremos la bd, tendra funcionalidades como
// ver productos, ver por productos mediante su ID.

import { PoolConnection, RowDataPacket } from "mysql2/promise";
import { obtenerConexion } from "../databases/conexion";

//creamos una interface para el producto
interface Producto extends RowDataPacket {
  idProducto: number;
  sku: number;
  nombreProducto: string;
  precio: number;
  descripcion: string;
  rating: number;
  imagen: string;
  stock: number;
  idCategoria: number;
}

// Función asincrónica que devuelve una lista de productos como un array de objetos de tipo Producto
export async function allProductos(): Promise<Producto[]> {
  // Obtiene una conexión de la base de datos mediante el pool de conexiones
  const conexion: PoolConnection = await obtenerConexion();
  try {
    // Realiza una consulta SQL para seleccionar todos los registros de la tabla "productos"
    // y almacena los resultados en la variable "resultados"
    const [resultados] = await conexion.query<Producto[]>(
      "SELECT * FROM bigcart.productos;"
    );
    // Retorna los resultados de la consulta como un array de productos
    return resultados;
  } catch (error) {
    // Captura y muestra cualquier error que ocurra durante la consulta
    console.error("Error al obtener los productos");
    throw error; // Lanza el error para que se gestione fuera de la función
  } finally {
    // Libera la conexión a la base de datos, independientemente de si ocurre un error o no
    conexion.release();
  }
}

// Función para obtener un producto específico por ID
export async function obtenerProductoPorId(id: number): Promise<any> {
  const conexion: PoolConnection = await obtenerConexion();
  try {
    console.log(id);
    const [resultados] = await conexion.query<Producto[]>(
      "SELECT * FROM bigcart.productos WHERE idProducto = ?;",
      [id]
    );
    // Si se encuentra un producto, retornarlo; de lo contrario, retornar null
    return resultados.length > 0 ? resultados[0] : null;
  } catch (error) {
    console.error("Error al obtener el producto por ID");
    throw error;
  } finally {
    conexion.release();
  }
}

export async function actulizarStock(id: number, stock: number) {
  const conexion: PoolConnection = await obtenerConexion();
  try {
    const [resultados] = await conexion.query(
      "UPDATE bigcart.productos SET stock = ? WHERE idProducto = ?",
      [stock, id]
    );
    return resultados;
  } catch (error) {

  }
}

// buscar por categorias 
export async function buscarPorCategoria(categoria: number) {
  const conexion: PoolConnection = await obtenerConexion();
  try {
    console.log('categoria en modelo:' + categoria);
    const [resultados] = await conexion.query<Producto[]>(
      "SELECT p.*, c.nombreCategoria FROM bigcart.productos AS p JOIN bigcart.categoria AS c ON p.idCategoria = c.idCategoria WHERE p.idCategoria = ?;",
      [categoria]
    );
    // si encuentra resultados retornar si no enviar error
    return resultados.length > 0 ? resultados : null;
  } catch (error) {
    console.error("Error al buscar por categoria");
    throw error;
  } finally{
    conexion.release();
  }
}

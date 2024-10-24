import { PoolConnection, RowDataPacket } from 'mysql2/promise';

import { obtenerConexion } from '../databases/conexion';

// Tipos para usuarios
interface Usuario extends RowDataPacket {
    id: number;
    nombre: string;
    correo: string;
    pass: string;
}

// Registrar un nuevo usuario
export async function registrar(nombre: string, email: string, password: string): Promise<void> {
    const conexion: PoolConnection = await obtenerConexion();
    try {
        

        // Insertar usuario en la base de datos
        await conexion.query(
            'INSERT INTO usuarios (nombre, correo, pass) VALUES (?, ?, ?)', 
            [nombre, email, password]
        );
        console.log('Usuario insertado correctamente');
    } catch (error) {
        console.error('Error al insertar usuario en el modelo:', error);
        throw error;
    } finally {
        conexion.release(); // Liberar la conexión al finalizar
    }
}

// Obtener usuario por correo
export async function obtenerPorCorreo(email: string): Promise<Usuario | null> {
    const conexion: PoolConnection = await obtenerConexion();
    try {
        // Ejecutar la consulta y tipar los resultados como RowDataPacket[]
        const [results] = await conexion.query<Usuario[] & RowDataPacket[]>(
            'select * from clientes join usuarios on clientes.idUsuario = usuarios.idUsuario where email = ?;', 
            [email]
        );
        
        return results.length > 0 ? results[0] : null;
    } catch (error) {
        console.error('Error al obtener usuario por correo en el modelo:', error);
        throw error;
    } finally {
        conexion.release(); // Liberar la conexión al finalizar
    }
}


// funcion para probar la api y validar que se conecta a la BD 
export async function obtenerTodosLosUsuarios(): Promise<Usuario[]> {
    const conexion: PoolConnection = await obtenerConexion();
    try {
        // Ejecutar la consulta para obtener todos los usuarios
        const [results] = await conexion.query<Usuario[] & RowDataPacket[]>(
            'SELECT * FROM usuarios;'
        );
        
        return results;
    } catch (error) {
        console.error('Error al obtener todos los usuarios en el modelo:', error);
        throw error;
    } finally {
        conexion.release(); // Liberar la conexión al finalizar
    }
}


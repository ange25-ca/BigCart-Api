
import { PoolConnection, RowDataPacket } from 'mysql2/promise';
import { obtenerConexion } from '../databases/conexion';

// Tipos para usuarios
interface Usuario extends RowDataPacket {
    idUsuario: number;
    username: string;
    lastname: string;
    age: number;
    email: string;
    phonenumber: number;
    adress: string;
    password: string;
    correo: string;
    pass: string;
}

// Obtener usuario por nombre
export async function obtenerPorNombre(username: string): Promise<Usuario | null> {
    const conexion: PoolConnection = await obtenerConexion();
    try {
        // Ejecutar la consulta y tipar los resultados como RowDataPacket[]
        const [results] = await conexion.query<Usuario[] & RowDataPacket[]>(
            'SELECT * FROM usuarios WHERE nombreUsuario = ?;',
            [username]
        );

        return results.length > 0 ? results[0] : null;
    } catch (error) {
        console.error('Error al obtener usuario por nombre en el modelo:', error);
        throw error;
    } finally {
        conexion.release(); // Liberar la conexión al finalizar
    }
}

// Registrar un nuevo usuario
export async function SignUp(username: string, lastname: string, age: number, email:string, 
    phonenumber:number, adress: string, password: string): Promise<void> {
    const conexion: PoolConnection = await obtenerConexion();
    try {
        // Insertar usuario en la base de datos
        await conexion.query(
            'INSERT INTO usuarios (nombreUsuario, apellido, edad, email, telefono, direccion, contraseña) VALUES (?, ?, ?, ?, ?, ?, ?)', 
            [username, lastname, age, email, phonenumber, adress, password]
        );
    } catch (error) {
        console.error('Error al insertar usuario en el modelo:', error);
        throw error;
    } finally {
        conexion.release(); // Liberar la conexión al finalizar
    }
}

export async function obtenerPorCorreo(email: string): Promise<Usuario | null> {
    const conexion: PoolConnection = await obtenerConexion();
    try {
        const [results] = await conexion.query<Usuario[] & RowDataPacket[]>( 
            'select * from clientes join usuarios on clientes.idUsuario = usuarios.idUsuario where email = ?;', 
            [email]
        );
        
        return results.length > 0 ? results[0] : null;
    } catch (error) {
        console.error('Error al obtener usuario por correo en el modelo:', error);
        throw error;
    } finally {
        conexion.release();
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


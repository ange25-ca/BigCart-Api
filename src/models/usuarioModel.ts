
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
    address: string;
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
    phonenumber:number, address: string, password: string): Promise<void> {
    const conexion: PoolConnection = await obtenerConexion();
    try {
        // Insertar usuario en la base de datos
        await conexion.query(
            'INSERT INTO usuarios (nombreUsuario, apellido, edad, email, telefono, direccion, contraseña) VALUES (?, ?, ?, ?, ?, ?, ?)', 
            [username, lastname, age, email, phonenumber, address, password]
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
            'SELECT * FROM usuarios WHERE email = ?;', 
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

// Función para obtener un usuario por ID
export async function obtenerUsuarioPorId(idUsuario: number): Promise<Usuario | null> {
    const conexion: PoolConnection = await obtenerConexion(); // Usa obtenerConexion
    try {
        const [results] = await conexion.query<Usuario[] & RowDataPacket[]>(
            'SELECT idUsuario, nombreUsuario, edad, apellido, email, telefono, direccion, perfilImagen FROM usuarios WHERE idUsuario = ?;',
            [idUsuario]
        );

        return results.length > 0 ? results[0] : null; // Devuelve el usuario o null
    } catch (error) {
        console.error('Error al obtener usuario por ID:', error);
        throw error; 
    } finally {
        conexion.release(); // Libera la conexión
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

//Actualización de la imagen 
// Función para actualizar la imagen de perfil del usuario
export async function actualizarImagenPerfil(idUsuario: number, profileImage: string): Promise<void> {
    const conexion: PoolConnection = await obtenerConexion();
    try {
        // Realizamos la consulta para actualizar el campo perfileImagen en la base de datos
        await conexion.query(
            'UPDATE usuarios SET perfilImagen = ? WHERE idUsuario = ?;',
            [profileImage, idUsuario]
        );
    } catch (error) {
        console.error('Error al actualizar la imagen de perfil:', error);
        throw error;
    } finally {
        conexion.release();
    }
}

// Función para obtener la imagen de perfil por ID de usuario
export async function obtenerImagenPerfil(idUsuario: number): Promise<string | null> {
    const conexion: PoolConnection = await obtenerConexion(); // Obtén la conexión a la base de datos
    try {
        // Realiza la consulta para obtener la imagen de perfil del usuario
        const [results] = await conexion.query<Usuario[] & RowDataPacket[]>(
            'SELECT perfilImagen FROM usuarios WHERE idUsuario = ?;',
            [idUsuario]
        );

        // Si se encuentra el usuario, retorna la URL de la imagen; de lo contrario, retorna null
        return results.length > 0 ? results[0].perfilImagen : null;
    } catch (error) {
        console.error('Error al obtener la imagen de perfil:', error);
        throw error; // Lanzar el error para ser manejado por la capa superior
    } finally {
        conexion.release(); // Liberar la conexión una vez finalizado
    }
}

// Actualizar los datos del usuario
export async function actualizarUsuario(idUsuario: number, data: { username?: string, 
    lastname?: string, 
    edad?: number, 
    email?: string, 
    phonenumber?: number, 
    address?: string, 
    profileImage?: string }): Promise<void> {
    const conexion: PoolConnection = await obtenerConexion();
    try {
        // Genera las partes de la consulta dinámica
        const setClause = [];
        const values: any[] = [];

        if (data.username) {
            setClause.push('nombreUsuario = ?');
            values.push(data.username);
        }
        if (data.lastname) {
            setClause.push('apellido = ?');
            values.push(data.lastname);
        }
        if (data.edad) {
            setClause.push('edad = ?');
            values.push(data.edad);
        }
        if (data.email) {
            setClause.push('email = ?');
            values.push(data.email);
        }
        if (data.phonenumber) {
            setClause.push('telefono = ?');
            values.push(data.phonenumber);
        }
        if (data.address) {
            setClause.push('direccion = ?');
            values.push(data.address);
        }
        console.log(data); // Verifica qué datos están llegando al backend

        // Si no hay ningún campo para actualizar, lanzamos un error
        if (setClause.length === 0) {
            throw new Error('No hay datos para actualizar.');
        }

        // Añadimos el ID al final de los valores
        values.push(idUsuario);
        console.log(data); // Verifica qué datos están llegando al backend

        // Construye la consulta SQL
        const query = `UPDATE usuarios SET ${setClause.join(', ')} WHERE idUsuario = ?`;

        // Ejecuta la consulta con los valores dinámicos
        await conexion.query(query, values);
    } catch (error) {
        console.warn('Error al actualizar los datos del usuario:', error);
        throw error;
    } finally {
        conexion.release(); // Liberar la conexión
    }
}

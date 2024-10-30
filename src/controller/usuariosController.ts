import { Request, Response } from 'express';
import { registrarUsuario, obtenerPorcorreo, obtenerUsuarios } from '../services/usuarioServices';
import authMiddleware from '../middleware/authMiddleware';

interface DatosSeguros {
    username: string;
    password: string;
}

async function loginUsuario(req: Request, res: Response): Promise<void> {
    console.log('Request Body:', req.body); 
    const { dataSegura }: { dataSegura: DatosSeguros } = req.body;

    // Verificación de datos recibidos
    if (!dataSegura || !dataSegura.username || !dataSegura.password) {
        res.status(400).send('Username y password son obligatorios');
        return;
    }
    //Junta el nombre y el pasword en el formato requerido
    const datosSeguraString = `${dataSegura.username},${dataSegura.password}`;

    try {
        // Descifra los datos usando `verificarDatos`
        const datosDescifrados = authMiddleware.verificarDatos(`${dataSegura.username},${dataSegura.password}`);

        // Imprime los datos descifrados en consola
        console.log("Nombre de usuario descifrado:", datosDescifrados.username);
        console.log("Contraseña descifrada:", datosDescifrados.password);

        // Aquí puedes proceder a autenticar al usuario con los datos descifrados
        const usuario = await obtenerPorcorreo(datosDescifrados.username); // ejemplo de búsqueda por username
        if (usuario && usuario.password === datosDescifrados.password) {
            res.status(200).send(`Bienvenido, ${datosDescifrados.username}!`);
        } else {
            res.status(401).send('Credenciales incorrectas');
        }
    } catch (error) {
        console.error("Error en la verificación de datos:", error);
        res.status(500).send("Error en la autenticación.");
    }
}

async function _obtenerUsuarioPorNombre(username: string) {
    try {
        const usuario = await obtenerPorcorreo(username);
        return usuario;
    } catch (error) {
        console.error('Error al obtener usuario por nombre API:', error);
        return null; // Devuelve null en caso de error
    }
}

// Función prueba: Ver todos los usuarios
async function verUsuarios(req: Request, res: Response): Promise<void> {
    try {
        const usuarios = await obtenerUsuarios();
        res.status(200).json(usuarios);
    } catch (error) {
        console.error('Error al obtener todos los usuarios:', error);
        res.status(500).send('Error interno del servidor');
    }
}

export {
    loginUsuario, 
    verUsuarios
};

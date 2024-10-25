import { Request, Response } from 'express';
import { registrarUsuario, obtenerPorcorreo, obtenerUsuarios } from '../services/usuarioServices';
import autenticador from '../middleware/autenticador';

interface DatosSeguros {
    username: string;
    email?: string; // Haciendo el email opcional
    password: string;
}

async function registroUsuario(req: Request, res: Response): Promise<void> {
    const { dataSegura }: { dataSegura: DatosSeguros } = req.body;

    if (!dataSegura.username || !dataSegura.password) {
        res.status(400).send('Username y password son obligatorios');
        return;
    }

    const datosSeguraString = `${dataSegura.username},${dataSegura.email || ''},${dataSegura.password}`;

    try {
        const datos = autenticador.verificarDatos(datosSeguraString);
        await registrarUsuario(datos.username, datos.email || '', datos.password); // Asegurando que email no sea undefined
        
        res.status(201).send('Usuario registrado correctamente');
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).send('Error interno del servidor');
    }
}

async function loginUsuario(req: Request, res: Response): Promise<void> {
    const { dataSegura }: { dataSegura: DatosSeguros } = req.body;

    if (!dataSegura.username || !dataSegura.password) {
        res.status(400).send('Username y password son obligatorios');
        return;
    }

    // Comprobar si el email está definido y construir la cadena de forma segura
    const datosSeguraString = dataSegura.email 
        ? `${dataSegura.username},${dataSegura.email},${dataSegura.password}`
        : `${dataSegura.username},,${dataSegura.password}`; // Asegurando un espacio en blanco para el email

    try {
        const datos = autenticador.verificarDatos(datosSeguraString);
        
        const usuario = await _obtenerUsuarioPorNombre(datos.username);
        
        if (!usuario) {
            res.status(404).send('Usuario o contraseña incorrectos');
            return;
        }

        const validPassword = await autenticador.comparePassword(datos.password, usuario.pass);

        if (!validPassword) {
            res.status(404).send('Usuario o contraseña incorrectos');
        } else {
            res.status(200).json(usuario);
        }
        
    } catch (error) {
        console.error('Error al logear usuario:', error);
        res.status(500).send('Error interno del servidor');
    }
}

async function _obtenerUsuarioPorNombre(username: string) {
    try {
        const usuario = await obtenerPorcorreo(username);
        return usuario;
    } catch (error) {
        console.error('Error al obtener usuario por nombre:', error);
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
    registroUsuario,
    loginUsuario, 
    verUsuarios
};

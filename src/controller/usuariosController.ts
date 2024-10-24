import { Request, Response } from 'express';
import {registrarUsuario, obtenerPorcorreo, obtenerUsuarios } from '../services/usuarioServices';
import autenticador from '../middleware/autenticador';

interface DatosSeguros {
    nombre: string;
    email: string;
    password: string;
}

async function registroUsuario(req: Request, res: Response): Promise<void> {
    const { dataSegura }: { dataSegura: DatosSeguros } = req.body;
    const datosSeguraString = `${dataSegura.nombre},${dataSegura.email},${dataSegura.password}`;
    try {
        const datos = autenticador.verificarDatos(datosSeguraString);
        await registrarUsuario(datos.nombre, datos.email, datos.password);
        
        res.status(201).send('Usuario registrado correctamente');
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).send('Error interno del servidor');
    }
}

async function loginUsuario(req: Request, res: Response): Promise<void> {
    const { dataSegura }: { dataSegura: DatosSeguros } = req.body;

    const datosSeguraString = `${dataSegura.nombre},${dataSegura.email},${dataSegura.password}`;

    try {
        const datos = autenticador.verificarDatos(datosSeguraString);
        console.log(datos);
        
        const usuario = await _obtenerUsuarioPorNombre(datos.nombre);
        console.log(usuario);
        
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



async function _obtenerUsuarioPorNombre(email: string) {
    try {
        const usuario = await obtenerPorcorreo(email);
        return usuario;
    } catch (error) {
        console.error('Error al obtener usuario por nombre:', error);
        return null; // Devuelve null en caso de error
    }
}

//función prueba: Ver todos los usuarios
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
    registrarUsuario,
    loginUsuario, 
    verUsuarios
};

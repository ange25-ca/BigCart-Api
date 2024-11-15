import { SignUp, obtenerPorCorreo, obtenerTodosLosUsuarios } from '../models/usuarioModel';


export async function obtenerUsuarios(): Promise<any[]> {  
    try {
        const usuarios = await obtenerTodosLosUsuarios();
        return usuarios;
    } catch (error) {
        console.error('Error al obtener todos los usuarios en el servicio:', error);
        throw error;
    }
}
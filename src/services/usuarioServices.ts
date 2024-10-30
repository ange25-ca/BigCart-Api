import { registrar, obtenerPorCorreo, obtenerTodosLosUsuarios } from '../models/usuarioModel';

export async function registrarUsuario(nombre: string, password: string): Promise<void> {
    try {
        await registrar(nombre, password);
    } catch (error) {
        console.error('Error al registrar usuario en el servicio:', error);
        throw error;
    }
}

export async function obtenerPorcorreo(nombre: string): Promise<any> {  // Cambia `any` por el tipo correspondiente si sabes qué estructura tiene el usuario
    try {
        return await obtenerPorCorreo(nombre);
    } catch (error) {
        console.error('Error al obtener usuario por nombre en el servicio:', error);
        throw error;
    }
}

export async function obtenerUsuarios(): Promise<any[]> {  // Cambia `any[]` por el tipo correspondiente si sabes qué estructura tienen los usuarios
    try {
        const usuarios = await obtenerTodosLosUsuarios();
        return usuarios;
    } catch (error) {
        console.error('Error al obtener todos los usuarios en el servicio:', error);
        throw error;
    }
}
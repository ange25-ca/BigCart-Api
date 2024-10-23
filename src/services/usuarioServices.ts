import { registrar, obtenerPorCorreo } from '../models/usuarioModel';

export async function registrarUsuario(nombre: string, email: string, password: string): Promise<void> {
    try {
        await registrar(nombre, email, password);
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


import { SignUp, obtenerPorCorreo, obtenerTodosLosUsuarios } from '../models/usuarioModel';
{/*
export async function registrarUsuario(username: string, lastname: string, age: number, email: string, 
    phonenumber: number, adress: string, password: string): Promise<void> {
    try {
        await SignUp(username, lastname, age, email, phonenumber, adress, password);
    } catch (error) {
        console.error('Error al registrar usuario en el servicio:', error);
        throw error;
    }
}

export async function obtenerPorcorreo(email: string): Promise<any> {  
    try {
        return await obtenerPorCorreo(email);
    } catch (error) {
        console.error('Error al obtener usuario por nombre en el servicio:', error);
        throw error;
    }
}*/}

export async function obtenerUsuarios(): Promise<any[]> {  
    try {
        const usuarios = await obtenerTodosLosUsuarios();
        return usuarios;
    } catch (error) {
        console.error('Error al obtener todos los usuarios en el servicio:', error);
        throw error;
    }
}
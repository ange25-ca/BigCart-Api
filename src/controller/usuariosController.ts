import { Request, Response } from 'express';
import { obtenerUsuarios } from '../services/usuarioServices';
import authMiddleware from '../middleware/authMiddleware';
import { obtenerPorNombre, obtenerPorCorreo, SignUp } from '../models/usuarioModel';

interface DatosSeguros {
    username: string;
    lastname: string;
    age: number;
    email: string;
    phonenumber: number;
    address: string;
    password: string;
}

// Función para el login del usuario
async function loginUsuario(req: Request, res: Response): Promise<void> {
    // Extrae los datos descifrados del req.body
    const { decryptedData } = req.body;
    // Verificación de datos descifrados
    if (!decryptedData || !decryptedData.username || !decryptedData.password) {
        res.status(400).send('Username y password son obligatorios');
        return;
    }

    try {
        // Busca el usuario en la base de datos por el nombre de usuario
        const usuario = await obtenerPorNombre(decryptedData.username);
        //console.log (usuario);
        // Verifica las credenciales
        if (usuario && usuario.contraseña === decryptedData.password) {
            res.status(200).send(`Bienvenido, ${decryptedData.username}!`);
        } else {
            res.status(401).send('Credenciales incorrectas mensaje de la api');
        }
    } catch (error) {
        console.error("Error en la verificación de datos:", error);
        res.status(500).send("Error en la autenticación.");
    }
}
async function _obtenerUsuarioPorNombre(username: string) {
    try {
        const usuario = await obtenerPorNombre(username);
        return usuario;
    } catch (error) {
        console.error('Error al obtener usuario por nombre API:', error);
        return null; // Devuelve null en caso de error
    }
}

async function SignUpNewUser(req: Request, res: Response): Promise<void> {
    const { username, lastname, age, email, phonenumber, address, password } = req.body as DatosSeguros;

    // Validación de datos
    if (!username || !lastname || !age || !email || !phonenumber || !address || !password) {
        res.status(400).send('Todos los campos son obligatorios');
        return; // Salida temprana sin retorno
    }

    // Asegúrate de que age sea un número
    const ageNumber = Number(age);
    if (isNaN(ageNumber)) {
        res.status(400).send('La edad debe ser un número válido');
        return; // Salida temprana sin retorno
    }

    try {
        console.log(email);
        
        // Verifica si el usuario ya existe por email
        const usuario = await obtenerPorCorreo(email); 
        if (usuario) {
            res.status(409).send('El usuario ya está registrado');
            return; // Salida temprana sin retorno
        }

        // Registrar el usuario
        await SignUp(username, lastname, ageNumber, email, phonenumber, address, password); 
        res.status(201).send('Usuario registrado exitosamente');
        // No necesitas un return aquí, ya que la función es void
    } catch (error) {
        console.error("Error al registrar el usuario:", error);
        res.status(500).send("Error al registrar el usuario");
        // No necesitas un return aquí, ya que la función es void
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
    SignUpNewUser,
    verUsuarios
};
import { Request, Response } from 'express';
import { obtenerUsuarios } from '../services/usuarioServices';
import authMiddleware from '../middleware/authMiddleware';
import { obtenerPorNombre, obtenerPorCorreo, SignUp, obtenerUsuarioPorId, actualizarImagenPerfil, obtenerImagenPerfil, actualizarUsuario } from '../models/usuarioModel';
import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';
import { error } from 'console';


interface DatosSeguros {
    //Se resiven dos pora el manejo del login
    username: string;
    password: string;
}

async function  loginUsuario(req: Request, res: Response): Promise<void> {
    // Obtiene la dataSegura de req.body
    const { dataSegura } = req.body
    // Verificación de los datos cifrados y desencriptación usando authMiddleware
    if (!dataSegura) {
        res.status(400).send('Datos cifrados son obligatorios');
        return;
    }

    try {
        //Se llama al middleware para desencriptar los datos
        const decryptedData = await authMiddleware.verificarLogin(dataSegura); 
        const { username, password } = decryptedData;

        // Busca el usuario en la base de datos por el nombre de usuario
        const usuario = await obtenerPorNombre(username);

        // Verifica las credenciales
        if (usuario && usuario.contraseña === password) {
            const token = jwt.sign({ userId: usuario.idUsuario }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
            res.status(200).json({
                message: `Bienvenido, ${username}!`,
                token,
                userId: usuario.idUsuario,
            });
        }  else {
            res.status(401).send('Credenciales incorrectas');
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
    try {
        // Extraer los datos cifrados
        const { dataSegura } = req.body;  //Los datos cifrados vienen en req.body como 'encryptedData'

        // Verificar y descifrar los datos
        const decryptedData = await authMiddleware.verificarDatos(dataSegura); // Usar el middleware para descifrar los datos
        
        // Desestructurar los datos descifrados
        const { username, lastname, age, email, phonenumber, address, password } = decryptedData;

        // Validación de datos
        if (!username || !lastname || !age || !email || !phonenumber || !address || !password) {
            res.status(400).send('Todos los campos son obligatorios');
            return; // Salida temprana
        }

        // Asegúrate de que age sea un número
        const ageNumber = Number(age);
        if (isNaN(ageNumber)) {
            res.status(400).send('La edad debe ser un número válido');
            return; // Salida temprana
        }

        // Si phonenumber debe ser un número, intenta convertirlo
        const phoneNumberNumber = Number(phonenumber);
        if (isNaN(phoneNumberNumber)) {
            res.status(400).send('El número de teléfono debe ser un número válido');
            return;
        }

        // Verifica si el usuario ya existe por email
        const usuario = await obtenerPorCorreo(email); 
        if (usuario) {
            res.status(409).send('El usuario ya está registrado');
            return; // Salida temprana
        }

        // Registrar el usuario con los datos descifrados
        await SignUp(username, lastname, ageNumber, email, phoneNumberNumber, address, password); 
        res.status(201).send('Usuario registrado exitosamente');
    } catch (error) {
        console.error("Error al registrar el usuario:", error);
        res.status(500).send("Error al registrar el usuario");
    }
}


async function obtenerDatosUsuario(req: Request, res: Response): Promise<void> {
    try {
        // Accede a userId desde res.locals (que se estableció en el middleware)
        const userId = res.locals.userId; 

        if (!userId) {
            res.status(400).send('ID de usuario no proporcionado');
            return;
        }
        const usuario = await obtenerUsuarioPorId(userId);
        if (!usuario) {
            res.status(404).send('Usuario no encontrado');
            return;
        }
        res.status(200).json(usuario);
    } catch (error) {
        console.error('Error al obtener datos del usuario:', error);
        res.status(500).send('Error interno del servidor');
    }
}


export const actualizarPerfil = async (req: Request, res: Response): Promise<void> => {
    const { idUsuario } = req.params;
    const { username, email, lastname, age, phonenumber, adress } = req.body; // Datos del usuario a actualizar
    const profileImage = req.file ? req.file.filename : null; // Imagen de perfil (si se proporciona)

    try {
        // Actualizar imagen si se envió una nueva imagen
        if (profileImage) {

            // Obtener la imagen anterior desde la base de datos
            const imagenAnterior = await obtenerImagenPerfil(Number(idUsuario));

            if (imagenAnterior) {
                const uploadPath = path.resolve(__dirname, '../../private/image/imageUser');
                let imagenPathAnterior = path.join(uploadPath, imagenAnterior);

                if (imagenAnterior.includes('images')) {
                    imagenPathAnterior = path.join(uploadPath, imagenAnterior.replace('images/', ''));
                }

                // Verifica si el archivo existe y elimina la imagen anterior
                if (fs.existsSync(imagenPathAnterior)) {
                    fs.unlinkSync(imagenPathAnterior); // Elimina la imagen anterior
                } else {
                    console.log('No se encontró la imagen anterior.');
                }
            }

            // Genera la URL pública de la nueva imagen
            let publicImagePath = path.join('/images', profileImage);
            publicImagePath = publicImagePath.replace(/\\/g, '/');

            // Actualiza la imagen de perfil en la base de datos
            await actualizarImagenPerfil(Number(idUsuario), publicImagePath);
        }

        // Actualizar otros datos del usuario si se enviaron
        const updateData = { username, lastname, age, email, phonenumber, adress };
        await actualizarUsuario(Number(idUsuario), updateData);

        // Responder con un mensaje de éxito y la nueva imagen (si se actualizó)
        res.status(200).json({
            message: 'Perfil actualizado correctamente.',
            profileImage: profileImage ? `/images/${profileImage}` : undefined, // Devuelve la nueva imagen si se actualizó
        });

    } catch (error) {
        console.error('Error al actualizar el perfil:', error);
        res.status(500).json({ message: 'Error al actualizar el perfil.' });
    }
};
export {
    loginUsuario,
    SignUpNewUser,
    obtenerDatosUsuario,   
};
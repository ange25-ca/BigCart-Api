import { Request, Response, NextFunction } from 'express';
import * as crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const algorithm = 'AES-GCM'; // Mismo algoritmo que en el frontend
const key = Buffer.from(process.env.SECRET_KEY as string, 'hex'); // Convertir la clave a un Buffer

export function decrypt(encryptedText: string): { data: string; iv: Buffer } {
    if (!encryptedText) {
        throw new Error('Texto cifrado no proporcionado para descifrar.');
    }
    
    const parts = encryptedText.split(':'); // Asume el formato IV:EncryptedData
    if (parts.length < 2) {
        throw new Error('Formato de texto cifrado incorrecto.');
    }

    const iv = Buffer.from(parts.shift() as string, 'hex'); // Obtener IV
    const encryptedBuffer = Buffer.from(parts.join(':'), 'hex'); // Obtener el texto cifrado

    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encryptedBuffer);
    decrypted = Buffer.concat([decrypted, decipher.final()]); // Manejar el final del cifrado

    return { data: decrypted.toString('utf8'), iv }; // Devuelve tanto el texto descifrado como el IV
}

export const decryptMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const { dataSegura } = req.body; // Obtener el objeto cifrado
        console.log('Data Segura:', dataSegura); // Imprimir para verificar

        // Validación de estructura de `dataSegura`
        if (!dataSegura || !dataSegura.username || !dataSegura.password) {
            res.status(400).send("Formato de datos incorrecto o datos faltantes.");
            return;
        }

        // Imprimir los datos cifrados
        console.log("Encrypted Username:", dataSegura.username);
        console.log("Encrypted Password:", dataSegura.password);

        // Desencriptar `username` y `password`
        const decryptedUsername = decrypt(dataSegura.username).data;
        const decryptedPassword = decrypt(dataSegura.password).data;

        console.log("Decrypted Username:", decryptedUsername);
        console.log("Decrypted Password:", decryptedPassword);

        // Almacenar los datos descifrados en la solicitud para usarlos más tarde
        req.body.decryptedData = {
            username: decryptedUsername,
            password: decryptedPassword,
        };
        next();

    } catch (error) {
        console.error("Error al descifrar datos:", error);
        res.status(400).send("Error al procesar datos cifrados.");
    }
};

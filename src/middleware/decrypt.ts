import { Request, Response, NextFunction } from 'express';
import * as crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const {VITE_AES_PRIVATE_KEY} = process.env;

const algorithm = 'AES-GCM'; // Mismo algoritmo que en el front
const key = Buffer.from(process.env.SECRET_KEY as string, 'hex'); // Convertir la clave a un Buffer

export const decryptData = async (encryptedData: string): Promise<string> => {
    const keyHex = VITE_AES_PRIVATE_KEY;
    if (!keyHex) throw new Error("La clave de cifrado no está configurada.");

    // Convertir la clave en hexadecimal a Uint8Array
    const keyBuffer = new Uint8Array(keyHex.match(/.{1,2}/g)!.map((byte: string) => parseInt(byte, 16)));

    // Separar IV y datos encriptados
    const [ivHex, encryptedHex] = encryptedData.split(':');
    
    // Convertir hexadecimal a Uint8Array
    const fromHexString = (hex: string) =>
        new Uint8Array(hex.match(/.{1,2}/g)!.map((byte: string) => parseInt(byte, 16)));

    const iv = fromHexString(ivHex);
    const encryptedBytes = fromHexString(encryptedHex);

    // Importar la clave para desencriptación
    const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyBuffer,
        'AES-GCM',
        false,
        ['decrypt']
    );

    // Desencriptar los datos
    const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        cryptoKey,
        encryptedBytes
    );

    // Decodificar los datos desencriptados
    const decodedData = new TextDecoder().decode(decrypted);

    return decodedData;
};

export const decryptMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { dataSegura } = req.body; // Obtener el objeto cifrado
        // Validación de estructura de `dataSegura`
        if (!dataSegura || !dataSegura.username || !dataSegura.lastname ||
            !dataSegura.age || !dataSegura.email || !dataSegura. phonenumber ||
            !dataSegura.password || !dataSegura.password) {
            res.status(400).send("Formato de datos incorrecto o datos faltantes.");
            return;
        }
        
        // Desencriptar `username` y `password`
        const decryptedUsername = await decryptData(dataSegura.username);
        const decryptedLastname = await decryptData(dataSegura.lastname);
        const decryptedAge = await decryptData(dataSegura.age);
        const decryptedEmail = await decryptData(dataSegura.Email);
        const decryptedPhonenumber = await decryptData(dataSegura.phonenumber);
        const decryptedAddress = await decryptData(dataSegura.address);
        const decryptedPassword = await decryptData(dataSegura.password);

        // Almacenar los datos descifrados en la solicitud para usarlos más tarde
        req.body.decryptedData = {
            username: decryptedUsername,
            lastname: decryptedLastname,
            age: decryptedAge,
            email: decryptedEmail,
            phonenumber: decryptedPhonenumber,
            address: decryptedAddress,
            password: decryptedPassword,
        };
        // Permite continuar con el siguiente middleware
        next();

    } catch (error) {
        console.error("Error al descifrar datos:", error);
        res.status(400).send("Error al procesar datos cifrados.");
    }
};
export default decryptData;
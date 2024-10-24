import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { Request, Response, NextFunction } from 'express';
import { RequestPersonalizado } from '../interfaces/requestPersonalizado';

interface UsuarioPayload {
    nombre: string;
    email: string;
    password: string;
}

const autenticador = {
// Middleware para verificar el token
verificarToken: function (req: RequestPersonalizado, res: Response, next: NextFunction): void {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        res.status(401).json({ mensaje: 'Token no proporcionado' });
        return;
    }

    const tokenParts = authHeader.split(' ');

    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
        res.status(401).json({ mensaje: 'Formato de token incorrecto' });
        return;
    }

    const token = tokenParts[1];
    const privateKey = process.env.RSA_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!privateKey) {
        res.status(500).json({ mensaje: 'Clave privada no encontrada' });
        return;
    }

    jwt.verify(token, privateKey, { algorithms: ['RS256'] }, (err, usuario) => {
        if (err) {
            res.status(403).json({ mensaje: 'Token inválido' });
            return;
        }

        req.usuario = usuario;
        next();
    });
},


// Función para verificar los datos
verificarDatos:  function (dataSegura: string): UsuarioPayload {
    const partes = dataSegura.split(',');
    const resultado: UsuarioPayload = { nombre: '',email: '', password: '' };

    partes.forEach((parte, index) => {
        if (index === 0) {
            resultado.nombre = this.decryptData(parte);
        } else if (index === 1 && partes.length > 2) {
            resultado.email = this.decryptData(parte);
        } else {
            resultado.password = this.decryptData(parte);
        }
    });

    return resultado;
},
// Función para descifrar datos encriptados
decryptData: function (encryptedText: string): string {
    const key = Buffer.from(process.env.AES_PRIVATE_KEY as string, 'hex');
    const [ivHex, authTagHex, encryptedHex] = encryptedText.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
},
// Función para comparar contraseñas encriptadas con bcrypt
comparePassword: async function (passwordString: string, bdHash: string): Promise<boolean> {
    return await bcrypt.compare(passwordString, bdHash);
}

};

export default autenticador;
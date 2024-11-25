import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Define una interfaz para el payload del JWT
interface JwtPayload {
    userId: string;
}

// Middleware de autenticación
const verifyMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization;

    // Verifica si se proporciona el encabezado de autorización
    if (!authHeader) {
        res.status(401).json({ message: 'Acceso denegado: No se proporcionó un token.' });
        return;
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        res.status(401).json({ message: 'Acceso denegado: Token no válido.' });
        return;
    }

    try {
        const secretKey = process.env.JWT_SECRET || 'secret'; // Clave secreta desde .env o predeterminada
        const decoded = jwt.verify(token, secretKey) as JwtPayload;

        // Si necesitas usar `userId` directamente en otras funciones, puedes pasarlo con `res.locals`
        res.locals.userId = decoded.userId;

        // Continúa con la siguiente función
        next();
    } catch (error) {
        console.error('Error al verificar el token:', error);
        res.status(401).json({ message: 'Token inválido o expirado.' });
    }
};

export default verifyMiddleware;
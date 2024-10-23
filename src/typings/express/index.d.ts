import { UsuarioPayload } from './path/to/your/interfaces';

declare global {
    namespace Express {
        interface Request {
            usuario?: UsuarioPayload;
        }
    }
}
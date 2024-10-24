import { JwtPayload } from "jsonwebtoken";  
import { Request } from "express";

// interface request personalizado para poder acceder al usuario, ya que por defecto no lo trae

export interface RequestPersonalizado extends Request{
    usuario?: string | JwtPayload;
    usuarioId?: string;
}

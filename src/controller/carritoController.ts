import { Request, Response } from 'express';
import { agregarAlCarrito } from '../services/carritoServices';

export async function addToCart(req: Request, res: Response): Promise<void> {
    try {
        // Extraer datos del cuerpo de la solicitud
        const { idCliente, idProducto, cantidad } = req.body;
       
        // Validaciones de entrada
        if (!idCliente || !idProducto || !cantidad) {
            res.status(400).send('Todos los campos (idCliente, idProducto, cantidad) son obligatorios');
            return;
        }

        const cantidadNumerica = Number(cantidad);
        if (isNaN(cantidadNumerica) || cantidadNumerica <= 0) {
            res.status(400).send('La cantidad debe ser un número válido mayor a 0');
            return;
        }

        // Llamar al servicio para agregar el producto al carrito
        await agregarAlCarrito(Number(idCliente), Number(idProducto), cantidadNumerica);

        // Responder con éxito
        res.status(200).json({
            message: 'Producto agregado al carrito exitosamente',
        });
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
        res.status(500).send('Error al agregar producto al carrito');
    }
}


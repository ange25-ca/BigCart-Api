import { Request, Response } from 'express';
import { agregarAlCarrito, allCartProductsService, getQuantityInCart, updateQuantityproduct, eliminarunproducto} from '../services/carritoServices';
import {getStock} from '../services/productosServices'
interface CarritoProducto {
    idProducto: number;
    Cantidad: number;
    nombreProducto: string;
    descripcion: string;
    precio: number;
    imagenUrl: string; //se agrega el url de la imagen
    idCarrito: number;
    idCliente: number;
    totalCarrito: number;
    estadoCarrito: string;
}
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


export async function viewAllCartProductos(req: Request, res: Response): Promise<void> {
    try {
        const idCart = parseInt(req.params.idCart, 10);


        console.log("Este es el idCarrito:", idCart);
        const carritoData: CarritoProducto[] = await allCartProductsService(idCart);




    // Separar detalles del carrito e items
    if (carritoData.length > 0) {
        const { idCarrito, idCliente, totalCarrito, estadoCarrito } = carritoData[0];
        const detallesCarrito = { idCarrito, idCliente, totalCarrito, estadoCarrito };


        const itemsCarrito = carritoData.map((item: CarritoProducto) => ({
            idProducto: item.idProducto,
            cantidad: item.Cantidad,
            nombreProducto: item.nombreProducto,
            descripcion: item.descripcion,
            precio: item.precio,
            imagen: item.imagenUrl,
        }));


        res.json({ detallesCarrito, itemsCarrito });
    } else {
        res.status(404).json({ message: "Carrito no encontrado" });
    }
    } catch (error) {
        console.error('Error al obtener productos del carrito:', error);
        res.status(500).send('Error al obtener productos del carrito');
    }
}






// Actualizar cantidad en el carrito
export async function updateCartQuantity(req: Request, res: Response): Promise<void> {
    const { cantidad, idCarrito, idProducto } = req.body;


    try {
        // Validar que los datos necesarios estén presentes
        if (!idCarrito || !idProducto || !cantidad) {
            res.status(400).json({ message: 'Faltan datos en la solicitud.' });
            return;
        }


        // Obtener stock disponible del producto
        const stockResult = await getStock(idProducto);


        if (!stockResult) {
            res.status(404).json({ message: 'Producto no encontrado.' });
            return;
        }
        const currentQuantityInCart = await getQuantityInCart(idCarrito, idProducto);


        // Calcular la nueva cantidad total en el carrito
        const newTotalQuantity = currentQuantityInCart + cantidad;


        // Validar si la nueva cantidad excede el stock
        if (newTotalQuantity > stockResult) {
            res.status(400).json({
                message: `La cantidad total solicitada (${newTotalQuantity}) excede el stock disponible (${stockResult}).`,
            });
            return;
        } else{
            await updateQuantityproduct(cantidad, idCarrito, idProducto );
        }


        // Actualizar la cantidad en carritoProducto
        res.status(200).json({ message: 'Cantidad actualizada correctamente.' });
    } catch (error) {
        console.error('Error al actualizar la cantidad en el carrito:', error);
        res.status(500).json({ message: 'Error al procesar la solicitud.' });
    }
}

export async function eliminarXProducto(req: Request, res: Response): Promise<void> {
    const {  idCarrito, idProducto } = req.body;
    try {
        // Validar que los datos necesarios estén presentes
        if (!idCarrito || !idProducto ) {
            res.status(400).json({ message: 'Faltan datos en la solicitud.' });
            return;
        }

        await eliminarunproducto(idCarrito,idProducto);
        res.status(200).json({ message: 'Producto eliminado correctamente.' });
    } catch{ 
        res.status(500).json({ message: 'Error al procesar la solicitud.' });
    }
}

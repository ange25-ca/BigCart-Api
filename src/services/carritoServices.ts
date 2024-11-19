import { agregarProductoAlCarrito } from '../models/carritoModels';


export async function agregarAlCarrito(idCliente: number, idproducto: number, Cantidad: number ): Promise<any> {
    console.log('idcliente desde controller' + idCliente);
    const carritoId = await agregarProductoAlCarrito(idCliente, idproducto, Cantidad);
    return carritoId;
}


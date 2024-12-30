import { shoppingview } from "../models/shoppingModel";


export async function shopview(idCliente: number): Promise<any> {
    const cart = await shoppingview(idCliente);
    //utilizamos una funcion ternaria para validar si cart no esta vacio, si esta vacio mandamos un mensaje de carrito vacio de o contrario se manda el cart
    return cart.length > 0 ? cart : { message: 'aun no hay compras realizadas' };
}
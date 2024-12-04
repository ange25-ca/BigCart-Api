import { agregarProductoAlCarrito, allCartProducts, getCurrentQuantityInCart, updateAddProductCart } from '../models/carritoModels';




export async function agregarAlCarrito(idCliente: number, idproducto: number, Cantidad: number ): Promise<any> {
    console.log('idcliente desde controller' + idCliente);
    const carritoId = await agregarProductoAlCarrito(idCliente, idproducto, Cantidad);
    return carritoId;
}


export async function allCartProductsService(idCart: number): Promise<any> {
    const cart = await allCartProducts(idCart);
    //utilizamos una funcion ternaria para validar si cart no esta vacio, si esta vacio mandamos un mensaje de carrito vacio de o contrario se manda el cart
    return cart.length > 0 ? cart : { message: 'Carrito vacio' };
}


export async function updateQuantityproduct(cantidad: number, idCarrito: number,  idproduct: number) {
    const update = await updateAddProductCart(cantidad, idCarrito,  idproduct);
    return update;
}


export async function getQuantityInCart(idCarrito: number, idProducto: number) {
    const cantidad = await getCurrentQuantityInCart(idCarrito,idProducto);
    return cantidad;
}
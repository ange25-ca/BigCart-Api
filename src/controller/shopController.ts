


import { shopview } from "../services/shopService";
import { Request, Response } from "express";

interface DetalleShop {
    idCompra: number;            // Identificador único de la compra
    Fecha_Compra: string;         // Fecha de la compra en formato string (ISO 8601 o similar)
    ID_Producto: number;          // Identificador único del producto
    Cantidad: number;            // Cantidad comprada del producto
    Imagen_URL: string;           // URL de la imagen del producto
    Descripcion_Producto: string; // Descripción del producto
  }
export async function viewAllShopProductos(req: Request, res: Response): Promise<void> {
  try {
    const idCliente = parseInt(req.params.idCliente, 10);

    console.log("Este es el idCliente:", idCliente);

    // Obtener datos desde la vista `shopview`
    const shopData: DetalleShop[] = await shopview(idCliente);

    if (shopData.length === 0) {
      res.status(404).json({ message: "No se encontraron compras para el cliente." });
      return;
    }

    // Agrupar los productos por idCompra
    const compras = shopData.reduce((acc, current) => {
      const compraIndex = acc.findIndex(
        (compra) => compra.detalleCompra.idCompra === current.idCompra
      );

      const product = {
        idProducto: current.ID_Producto,
        cantidad: current.Cantidad,
        imagenUrl: current.Imagen_URL,
        descripcionProducto: current.Descripcion_Producto,
      };

      if (compraIndex === -1) {
        // Si no existe la compra en el acumulador, agregarla
        acc.push({
          detalleCompra: {
            idCompra: current.idCompra,
            Fecha_Compra: current.Fecha_Compra,
          },
          itemShop: [product],
        });
      } else {
        // Si ya existe, agregar el producto al array de itemShop
        acc[compraIndex].itemShop.push(product);
      }

      return acc;
    }, [] as { detalleCompra: { idCompra: number; Fecha_Compra: string }; itemShop: any[] }[]);

    res.json(compras);
  } catch (error) {
    console.error("Error al obtener productos del carrito:", error);
    res.status(500).send("Error al obtener productos del carrito");
  }
}
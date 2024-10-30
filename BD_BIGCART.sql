CREATE DATABASE  IF NOT EXISTS `bigcart`; 

USE  bigCart;

CREATE TABLE usuarios(
    idUsuario INT AUTO_INCREMENT PRIMARY KEY,
    nombreUsuario VARCHAR(50) NOT NULL,
    edad INT NOT NULL, 
    apellido VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    contraseña VARCHAR(100) NOT NULL,
    rol ENUM('admin', 'cliente') DEFAULT 'cliente'
);

CREATE TABLE clientes(
    idCliente INT AUTO_INCREMENT PRIMARY KEY,
    idUsuario INT NOT NULL UNIQUE,
    direccion VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    FOREIGN KEY (idUsuario) REFERENCES usuarios(idUsuario)
);

CREATE TABLE categoria(
    idCategoria INT AUTO_INCREMENT PRIMARY KEY,
    nombreCategoria VARCHAR(50) NOT NULL,
    descripcion VARCHAR(100) NOT NULL
);


CREATE TABLE productos(
    idProducto Int AUTO_INCREMENT PRIMARY KEY,
    sku VARCHAR (15) NOT NULL,
    nombreProducto VARCHAR(100) NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    imagenUrl VARCHAR(255),
    stock INT NOT NULL,
    idCategoria int not null,
    FOREIGN KEY (idCategoria) REFERENCES categoria(idCategoria)
);

CREATE TABLE carritoCompras(
    idCarrito INT AUTO_INCREMENT PRIMARY KEY,
    idCliente INT NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    estadoCarrito VARCHAR(30) not null,
    FOREIGN KEY (idCliente) REFERENCES clientes(idCliente)
);

CREATE TABLE carritoProducto(
    idCarritoProducto INT NOT NULL,
    idCarrito INT NOT NULL,
    idProducto INT NOT NULL,
    Cantidad INT NOT NULL,
    FOREIGN KEY (idCarrito) REFERENCES carritoCompras(idCarrito),
    FOREIGN KEY (idProducto) REFERENCES productos(idProducto)
);

CREATE TABLE compra(
    idCompra INT AUTO_INCREMENT PRIMARY KEY,
    idCliente INT NOT NULL,
    fechaCompra DATE NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (idCliente) REFERENCES clientes(idCliente)
);

CREATE TABLE detalleCompra(
    idDetalle INT AUTO_INCREMENT PRIMARY KEY,
    idCompra INT NOT NULL,
    idProducto INT NOT NULL,
    cantidad INT NOT NULL,
    FOREIGN KEY (idCompra) REFERENCES compra(idCompra),
    FOREIGN KEY (idProducto) REFERENCES productos(idProducto)
);

-- Se inserta un usuario como prueba 
INSERT INTO usuarios (nombreUsuario, edad, apellido, email, contraseña, rol)
VALUES (
'JuanPerez', 30, 'Perez', 
'juan.perez@example.com', 
'password123', 'cliente');

INSERT INTO usuarios (nombreUsuario, edad, apellido, email, contraseña, rol)
VALUES (
    'username', 
    30, 
    'Perez', 
    'Username.prueba@example.com', 
    '23,16,54:12,78,99:10,25,77,65,89,12,43:15,32,78:60,90,18,29,74,51,30,92', 
    'cliente'
);



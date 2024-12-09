import mysql2 from 'mysql2'
import dotenv from 'dotenv';
import { Pool } from 'mysql2/typings/mysql/lib/Pool';

// Configura DotEnv
dotenv.config();

// Crear pool de conexiones a la base de datos MySQL
const pool : Pool = mysql2.createPool({
    host: process.env.ACCESS_DB_HOST,
    user: process.env.ACCESS_DB_USER,
    password: process.env.ACCESS_DB_PASSWORD,
    database: process.env.ACCESS_DB_DATABASE,
    port: Number(process.env.ACCESS_DB_PORT),
    waitForConnections: true,
    connectionLimit: 100,
    queueLimit: 0
});

// Obtener una conexión del pool
function obtenerConexion() {
    return pool.promise().getConnection();
}

export { obtenerConexion };

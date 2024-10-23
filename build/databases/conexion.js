"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.obtenerConexion = obtenerConexion;
const mysql2_1 = __importDefault(require("mysql2"));
const dotenv_1 = __importDefault(require("dotenv"));
// Configura DotEnv
dotenv_1.default.config();
// Crear pool de conexiones a la base de datos MySQL
const pool = mysql2_1.default.createPool({
    host: process.env.ACCESS_DB_HOST,
    user: process.env.ACCESS_DB_USER,
    password: process.env.ACCESS_DB_PASSWORD,
    database: process.env.ACCESS_DB_DATABASE,
    port: Number(process.env.ACCESS_DB_PORT),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
// Obtener una conexión del pool
function obtenerConexion() {
    return pool.promise().getConnection();
}

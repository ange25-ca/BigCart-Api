import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import routes from './routers/routes';
import path from 'path';

const app = express();
const port = 3000;

app.use(cors({ 
    origin: 'http://localhost:5173',
    credentials: true })); // Configuración de CORS

app.use(express.json()); // Middleware para parsear JSON

app.use('/', routes);

// Permite el acceso a la carpeta public para la visualización de las imagenes
app.use(express.static(path.join(__dirname, '..', 'public')));

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});




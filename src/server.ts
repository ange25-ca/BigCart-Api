import express from 'express';
import cors from 'cors';
import routes from './routers/routes';

const app = express();
const port = 3000;

app.use(cors({ origin: 'http://localhost:5173' })); // Configuración de CORS
app.use(express.json()); // Middleware para parsear JSON

app.use('/', routes);

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});




import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Definir la carpeta donde se guardarán las imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../private/image/imageUser'); // Ajusta la ruta según tu estructura de carpetas
    
    // Asegúrate de que la carpeta exista, si no, créala
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath); // Establecer el destino para el archivo subido
  },
  filename: (req, file, cb) => {
    // Asegúrate de que el idUsuario esté presente en la solicitud
    const idUsuario = req.params.idUsuario || req.body.idUsuario; // Ajusta según cómo lo pases en la solicitud
    const filename = `${idUsuario}-${file.originalname}`;
    cb(null, filename); // Nombre del archivo con el idUsuario
  }
});

// Configuración de multer
const upload = multer({ storage });

export default upload;

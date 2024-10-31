
import { decryptData } from "./decrypt" //

interface UsuarioPayload {
    username: string;
    password: string;
}

const authMiddleare = {
    // Función para verificar y descifrar los datos
    verificarDatos: function (dataSegura: string): UsuarioPayload {
    const partes = dataSegura.split(',');
    const resultado: UsuarioPayload = { username: '', password: '' };

    if (partes.length < 2) {
        throw new Error('Datos insuficientes para procesar');
    }

    // Desencripta username y password
    const encryptedUsername = partes[0]; // Username cifrado en la primera posición
    const encryptedPassword = partes[partes.length - 1]; // Password cifrado en la última posición

    console.log(decryptData(encryptedUsername));
    console.log(decryptData(encryptedPassword));

    // Imprimir en consola el nombre de usuario y la contraseña descifrados
    console.log("Username descifrado:", resultado.username);
    console.log("Password descifrado:", resultado.password);

    return resultado;
},

}

export default authMiddleare;

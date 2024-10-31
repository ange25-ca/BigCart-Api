
import { decryptData } from "./decrypt" //

interface UsuarioPayload {
    username: string;
    password: string;
}
{/*
const authMiddleare = {
    // Función para verificar y descifrar los datos
    verificarDatos: function (dataSegura: string): UsuarioPayload {
    const partes = dataSegura.split(',');
    const resultado: UsuarioPayload = { username: '', password: '' };

    if (partes.length < 2) {
        throw new Error('Datos insuficientes para procesar');
    } else {

    // Desencripta username y password
    const encryptedUsername = partes[0]; // Username cifrado en la primera posición
    const encryptedPassword = partes[partes.length - 1]; // Password cifrado en la última posición

    //Son los que manda de promesa { <pending >}
    console.log(decryptData(encryptedUsername));
    console.log(decryptData(encryptedPassword));

    return resultado;

}
},}*/}

const authMiddleare = {
    // Función para verificar y descifrar los datos
    verificarDatos: async function (dataSegura: string): Promise<UsuarioPayload> {
        const partes = dataSegura.split(',');
        if (partes.length < 2) {
            throw new Error('Datos insuficientes para procesar');
        }

        const encryptedUsername = partes[0];
        const encryptedPassword = partes[partes.length - 1];

        // Usa await para descifrar si decryptData es asíncrono
        const username = await decryptData(encryptedUsername);
        const password = await decryptData(encryptedPassword);

        return { username, password };
    },
};
export default authMiddleare;

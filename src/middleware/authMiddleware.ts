import { decryptData } from "./decrypt"; 

interface UsuarioPayload {
    username: string;
    lastname: string;
    age: number;
    email: string;
    phonenumber: number;
    address: string;
    password: string;
}

const authMiddleare = {
    // Función para verificar y descifrar los datos
    verificarDatos: async function (dataSegura: any): Promise<UsuarioPayload> {
        const {
            username: encryptedUsername,
            lastname: encryptedLastname,
            age: encryptedAge,
            email: encryptedEmail,
            phonenumber: encryptedPhonenumber,
            address: encryptedAddress,
            password: encryptedPassword
        } = dataSegura;

        // Asegúrate de que todos los campos cifrados existen
        if (!encryptedUsername || !encryptedLastname || !encryptedAge || !encryptedEmail || !encryptedPhonenumber || !encryptedAddress || !encryptedPassword) {
            throw new Error('Datos insuficientes para procesar');
        }

        // Desencriptar cada campo
        const username = await decryptData(encryptedUsername);
        const lastname = await decryptData(encryptedLastname);
        const email = await decryptData(encryptedEmail);
        const address = await decryptData(encryptedAddress);
        const password = await decryptData(encryptedPassword);

        // Asegúrate de convertir age y phonenumber a números
        const age = Number(await decryptData(encryptedAge));  // Convertir a number
        const phonenumber = Number(await decryptData(encryptedPhonenumber));  // Convertir a number

        // Verifica si la conversión de age o phonenumber falló
        if (isNaN(age) || isNaN(phonenumber)) {
            throw new Error('El campo age o phonenumber no es válido');
        }

        return { username, lastname, age, email, phonenumber, address, password };
    },

    // Función para verificar solo los datos necesarios para login (username y password)
    verificarLogin: async function (dataSegura: { email: string; password: string }): Promise<{ email: string; password: string }> {
        const { email: encryptedEmail, password: encryptedPassword } = dataSegura;

        // Asegúrate de que username y password cifrados existen
        if (!encryptedEmail || !encryptedPassword) {
            throw new Error("Datos insuficientes para procesar");
        }

        // Desencripta username y password
        const email = await decryptData(encryptedEmail);
        const password = await decryptData(encryptedPassword);

        return { email, password };
    },
};

export default authMiddleare;
const CryptoJS = require('crypto-js');
const dotenv = require('dotenv');

dotenv.config();

const claveSecreta = process.env.CLAVE_SECRETA || 'cifrarDatos';

function cifrarDatos(datos) {
    try {
        const cifrado = CryptoJS.AES.encrypt(JSON.stringify(datos), claveSecreta).toString();
        return cifrado;
    } catch (error) {
        console.error('Error al cifrar datos:', error.message);
        throw error;
    }
}

function descifrarDatos(cifrado) {
    try {
        const bytes = CryptoJS.AES.decrypt(cifrado, claveSecreta);
        const datos = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        return datos;
    } catch (error) {
        console.error('Error al descifrar datos:', error.message);
        throw error;
    }
}

function descifrarSeguro(valor) {
    try {
        if (!valor) return null;

        const bytes = CryptoJS.AES.decrypt(valor, claveSecreta);
        const texto = bytes.toString(CryptoJS.enc.Utf8);

        if (!texto) return valor; // no estaba cifrado

        return JSON.parse(texto);
    } catch (error) {
        // Si falla, devolvemos el valor original
        return valor;
    }
}


module.exports = {
    cifrarDatos,
    descifrarDatos,
    descifrarSeguro
}
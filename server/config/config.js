//=========================================================//
//puerto
process.env.PORT = process.env.PORT || 3000;
//=========================================================//
//Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//=========================================================//
//Base de datos
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = "base_datos";
} else {
    urlDB = process.env.MONGO_URI
}
process.env.urlDB = urlDB;
//=========================================================//
//Vencimiento token
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;
//=========================================================//
//SEED DE AUTENTIFICACION
process.env.SEED = process.env.SEED || 'este-es-mi-clave-en-dev';

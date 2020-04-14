//Importamos la librearia de promise mysql
import mysql from 'promise-mysql';
//E importamos las llaves de nuestra base de datos
import keys from './keys';

//Metodo ideal para produccion, se manda la configuracion pre-establecida en un archivo
const pool = mysql.createPool(keys.database);

//El metodo get conection nos permitira poder mandar consultas y funciones de mysql
pool.getConnection()
.then(connection =>{
    //ya que funciona a traves de promesas, manda la coneccion una vez obtenida
   pool.releaseConnection(connection); 
   //en caso de funcionar manda el mensaje que la base de datos se encuentra funcional
   console.log('DB is connected');
});

//Creamos una segunda conexion de tipo mysql
var mysql2 = require('mysql');
var var2 = mysql2.createConnection(keys.database);
var2.connect();


export default pool;
export var connection = var2;
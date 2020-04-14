import { Request, Response } from 'express';
//importamos las queries necesarias
import { loginUser, loginCompany } from '../queries';
//Y nuestro metodo para encriptar
import { cryptPassword } from '../encrypt';

import mysql from 'promise-mysql';

//Aqui es donde traemos todo nuestra informacion de la DB
import pool, { connection } from '../database';

class LoginController{

    //Ya que tenemos que declarar los tipos de variables que estamos obteniendo, utilizamos la libreria de express para declararlos
    public async login (req: Request ,res: Response) {
        const { email, password, isCompany } = req.body;

        var query;
        if(isCompany) {
            query = connection.query(loginCompany + ' WHERE email = \'' + email + '\' AND password = \'' + password + '\'');
        } else {
            query = connection.query(loginUser + ' WHERE email = \'' + email + '\' AND password = \'' + password + '\'');
        }

        //Y creamos nuestro arreglo de usuarios
        var user: any;
        //Ya que el metodo pool no tiene esta funcion , generamos una tipo connection
        query  
        .on('error', function(err:any) {
            //En caso de haber un error...
            if (err) throw err;
            res.json({ result: false, msg: 'Error ocurred when retriving data ' + err});
        })
        .on('result', function(row:any ) {
        //La funcion principal de este metodo esta aqui
        //por cada "row" o fila, pausamos la query
        connection.pause(); 

        if(req.query.isCompany) {
            user = {
                idUser: row['id'],
                name: row['name'],
                email: row['email'],
                created_at: row['created_at']
            }
        } else {
            user = {
                idUser: row['id'],
                name: row['name'],
                lastname: row['lastname'],
                email: row['email'],
                created_at: row['created_at']
            }
        }

        console.log(user);

        //Y continuamos con la query
        connection.resume();
        })
        .on('end', function() {
            //Creamos nuestra variable result, la cual sera la que se convertira en nuestra respuesta JSON
            var result;
            //Si obtenemos mas de 1 resultado, regresamos verdadero 
            if(user == undefined || user == null){
                result = { result: true, data: {}}
            }else{
                //caso contrario, regresamos falso 
                result = { result: true, data: user}
            }
            //Regresamos los resultados de la busqueda
            return res.json(result);
        });
    }
}

//Se exporta toda la clase para poder utilizar todos estos metodos
export const loginController = new LoginController();

import { Request, Response } from 'express';
//importamos las queries necesarias
import { usersQuery , userQuery } from '../queries';
//Y nuestro metodo para encriptar
import { cryptPassword } from '../encrypt'

import mysql from 'promise-mysql';

//Aqui es donde traemos todo nuestra informacion de la DB
import pool, { connection } from '../database';

class UsersController{

    //Ya que tenemos que declarar los tipos de variables que estamos obteniendo, utilizamos la libreria de express para declararlos
    public async list (req: Request ,res: Response) {
        //Aqui las cosas se pusieron dificiles....
        //Primeramente creamos nuestra conexion con nuestra query indicada
        var query = connection.query(usersQuery);
        //Y creamos nuestro arreglo de usuarios
        var users: any[] = [];
        //Ya que el metodo pool no tiene esta funcion , generamos una tipo connection
        query  
        .on('error', function(err:any) {
            //En caso de haber un error...
            if (err) throw err;
            res.json('Error ocurred when retriving data ' + err);
        })
        .on('result', function(row:any ) {
        //La funcion principal de este metodo esta aqui
        //por cada "row" o fila, pausamos la query
        connection.pause(); 

        //Y se los asignamos al usuario
        var user = {
            idUser: row['id'], 
            name: row['name'],
            lastname: row['lastname'],
            email: row['email'],
            password: row['password'],
            create_date: row['create_date']
        }

        //Empujamos nuestra fila al arreglo de usuarios
        users.push(user);

        //Y continuamos con la query
        connection.resume();
        })
        .on('end', function() {
            //Creamos nuestra variable result, la cual sera la que se convertira en nuestra respuesta JSON
            var result;
            //Si obtenemos mas de 1 resultado, regresamos verdadero 
            if(users.length > 0 ){
                result = { result: true, data: users}
            }else{
                //caso contrario, regresamos falso 
                result = { result: false, data: []}
            }
            //Regresamos los resultados de la busqueda
            return res.json(result);
        });
    } 

    public async getOne(req: Request, res: Response){
        //Obtenemos el id 
        const { id } = req.params;
        //Creamos nuestra query
        var query = connection.query(userQuery + ' WHERE id = ?', [id]);
        //Y creamos nuestra variable donde almacenaremos al objeto seleccionado
        var user: any;
        //Ya que el metodo pool no tiene esta funcion , generamos una tipo connection
        query  
        .on('error', function(err:any) {
            //En caso de haber un error...
            if (err) throw err;
            res.json('Error ocurred when retriving data ' + err);
        })
        .on('result', function(row:any ) {
        //La funcion principal de este metodo esta aqui
        //por cada "row" o fila, pausamos la query
        connection.pause();
        //Asignamos los valores del objeto
        user = {
            idUser: row['id'], 
            name: row['name'],
            lastname: row['lastname'],
            email: row['email'],
            password: row['password'],
            create_date: row['create_date']
        }

        //Y continuamos con la query
        connection.resume();
        })
        .on('end', function() {
            //Generamos nuestra variable que se convertira en nuestro JSON
            var result;
            //Si nuesto objeto no se define o esta vacio...
            if(user == undefined || user == null ){
                //Devolvemos que nuestra busqueda no arrojo resultados
                result = { result: false, data: {}}
                
            }else{
                //caso contrario, regresamos verdadero y nuestro objeto 
                result = { result: true, data: user}
            }
            //Regresamos los resultados de la busqueda
            return res.json(result);
        });


    }

    //Creamos nuestro metodo Async, para que no tengamos que esperar y poder aprovechar los recursos
    public async create(req: Request, res: Response){
        var that = this;
        //Obtenemos la password
        const { email, name , lastname, password } = req.body;

        var user = {
            name: name,
            lastname: lastname,
            email: email,
            password: password
        }

        //convertimos nuestro objeto en una query
        var queryuser = connection.escape(user);
        var result;

        //Y hacemos nuestra query tipo pool
        pool.query('INSERT INTO users  SET ' + queryuser , function (error: any, results: any, fields: any) {
            //En caso de tener un error, mandamos el error
            if(error){
                res.json('No client was added ' + error);
                throw error;
            } 

            //Ya que en un insert no nos interesa el dato, solamente preguntamos por las filas afectadas
            //En caso de ser mas de una, devolvemos que nuestra consulta fue verdadera
            if(results.affectedRows > 0 ){
                result = { result: true}
            }else{
                //caso contrario, regresamos falso 
                result = { result: false}
            }

            return res.json(result);
        })
            //En caso de haber otro tipo de error
        .catch(function(err) {
            res.json({
                result: false,
                data: {
                    code: err.code,
                    error: err.errno,
                    state: err.sqlState
                }
            });
        });
    }

    public async delete(req: Request, res: Response){
        //Obtenemos la id a partir de los parametros
        const { id } = req.params;
        //Generamos nuestra query
        var query = mysql.format('DELETE FROM t_clients WHERE id= ?' ,[id]);
        var result = await pool.query(query, function(error: any, results: any, fields: any){
            //En caso de haber un error
            if(error){
                res.json('No client was changed' + error);
                throw error;
            } 

            var result;
            //Ya que en un delete no nos interesa el dato, solamente preguntamos por las filas afectadas
            //En caso de ser mas de una, devolvemos que nuestra consulta fue verdadera
            if(results.affectedRows > 0 ){
                result = { result: true}
            }else{
                //caso contrario, regresamos falso 
                result = { result: false}
                
            }
            //Regresamos los resultados de la busqueda
            return res.json(result);
        })
        //En caso de que ocurra otro tipo de error
        .catch(function(err) {
            res.json({
                result: false,
                data: {
                    code: err.code,
                    error: err.errno,
                    state: err.sqlState
                }
            });
        });
    }

    public async update(req: Request, res: Response){
        //obtenemos todos los tipos de valores esperados
        const { id } = req.params;
        const { name , email, lastname} = req.body;

        //Creamos nuestro objeto con sus valores
        var user = {
            name: name, 
            email: email, 
            lastname: lastname
        }
        //Y le damos forma a nuestra query con el objeto
        var query = mysql.format('UPDATE t_clients SET ? WHERE id= ?',[user, id]);

        pool.query(query , function(error: any, results: any, fields: any){
            //En caso de haber un error
            if(error){
                res.json('No user was changed' + error);
                throw error;
            } 
    
            var result;
            //Ya que en un update no nos interesa el dato, solamente preguntamos por las filas afectadas
            //En caso de ser mas de una, devolvemos que nuestra consulta fue verdadera
            if(results.affectedRows > 0 ){
                result = { result: true}
            }else{
                //caso contrario, regresamos falso 
                result = { result: false}
                
            }
            //Regresamos los resultados de la busqueda
            return res.json(result);
        })
        //En caso de obtener otro tipo de error
        .catch(function(err) {
            res.json({
                result: false,
                data: {
                    code: err.code,
                    error: err.errno,
                    state: err.sqlState
                }
            });
        });
    }
}

//Se exporta toda la clase para poder utilizar todos estos metodos
export const usersController = new UsersController();

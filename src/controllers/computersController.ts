import { Request, Response } from 'express';
//importamos las queries necesarias
import { computersQuery , computerQuery } from '../queries';
//Y nuestro metodo para encriptar
import { cryptPassword } from '../encrypt'

import mysql from 'promise-mysql';

//Aqui es donde traemos todo nuestra informacion de la DB
import pool, { connection } from '../database';

class ComputersController{

    //Ya que tenemos que declarar los tipos de variables que estamos obteniendo, utilizamos la libreria de express para declararlos
    public async list (req: Request ,res: Response) {
        //Aqui las cosas se pusieron dificiles....
        //Primeramente creamos nuestra conexion con nuestra query indicada
        var query;
        if(!(Object.entries(req.query).length === 0 && req.query.constructor === Object)) {
            if(req.query.search !== null) {
                var whereClause = ' WHERE';
                whereClause += ' brand LIKE \'%' + req.query.search + '%\' OR';
                whereClause += ' serial_number LIKE \'%' + req.query.search + '%\'';
                query = connection.query(computersQuery + whereClause);
            } else {
                query = connection.query(computersQuery);
            }
        } else {
            query = connection.query(computersQuery);
        }
        //Y creamos nuestro arreglo de usuarios
        var computers: any[] = [];
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
        var computer = {
            idComputer: row['id'], 
            brand: row['brand'],
            serial_number: row['serial_number'],
            QR: row['QR'],
            created_at: row['created_at']
        }

        //Empujamos nuestra fila al arreglo de usuarios
        computers.push(computer);

        //Y continuamos con la query
        connection.resume();
        })
        .on('end', function() {
            //Creamos nuestra variable result, la cual sera la que se convertira en nuestra respuesta JSON
            var result;
            //Si obtenemos mas de 1 resultado, regresamos verdadero 
            if(computers.length > 0 ){
                result = { result: true, data: computers}
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
        var query = connection.query(computerQuery + ' WHERE id = ?', [id]);
        //Y creamos nuestra variable donde almacenaremos al objeto seleccionado
        var computer: any;
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
        computer = {
            idComputer: row['id'], 
            brand: row['brand'],
            serial_number: row['serial_number'],
            QR: row['QR'],
            created_at: row['created_at']
        }

        //Y continuamos con la query
        connection.resume();
        })
        .on('end', function() {
            //Generamos nuestra variable que se convertira en nuestro JSON
            var result;
            //Si nuesto objeto no se define o esta vacio...
            if(computer == undefined || computer == null ){
                //Devolvemos que nuestra busqueda no arrojo resultados
                result = { result: false, data: {}}
                
            }else{
                //caso contrario, regresamos verdadero y nuestro objeto 
                result = { result: true, data: computer}
            }
            //Regresamos los resultados de la busqueda
            return res.json(result);
        });
    }

    //Creamos nuestro metodo Async, para que no tengamos que esperar y poder aprovechar los recursos
    public async create(req: Request, res: Response){
        var that = this;
        //Obtenemos la password
        const { brand, serial_number , QR } = req.body;

        var computer = {
            brand: brand,
            serial_number: serial_number,
            QR: QR
        }

        //convertimos nuestro objeto en una query
        var querycomputer = connection.escape(computer);
        var result;

        //Y hacemos nuestra query tipo pool
        pool.query('INSERT INTO computers SET ' + querycomputer , function (error: any, results: any, fields: any) {
            //En caso de tener un error, mandamos el error
            if(error){
                res.json('No computer was added ' + error);
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
export const computersController = new ComputersController();

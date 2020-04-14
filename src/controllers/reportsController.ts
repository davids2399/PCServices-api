import { Request, Response } from 'express';
//importamos las queries necesarias
import { reportsQuery , reportQuery, reportsWithFK } from '../queries';
//Y nuestro metodo para encriptar
import { cryptPassword } from '../encrypt'

import mysql from 'promise-mysql';

//Aqui es donde traemos todo nuestra informacion de la DB
import pool, { connection } from '../database';

class ReportsController{

    //Ya que tenemos que declarar los tipos de variables que estamos obteniendo, utilizamos la libreria de express para declararlos
    public async list (req: Request ,res: Response) {
        //Aqui las cosas se pusieron dificiles....
        //Primeramente creamos nuestra conexion con nuestra query indicada
        var query;
        if(!(Object.entries(req.query).length === 0 && req.query.constructor === Object)) {
            if(req.query.reportList) {
                query = connection.query(reportsWithFK);
            } else {
                query = connection.query(reportsQuery);
            }
        } else {
            console.log('normal query 1')
            query = connection.query(reportsQuery);
        }
        //Y creamos nuestro arreglo de usuarios
        var reports: any[] = [];
        var report
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
        report = {
            idReport: row['id'], 
            computer_id: row['computer_id'],
            company_id: row['company_id'],
            user_id: row['user_id'],
            service_id: row['service_id'],
            visit_start_time: row['visit_start_time'],
            visit_end_time: row['visit_end_time'],
            description: row['description'],
            created_at: row['created_at']
        }

        if(!(Object.entries(req.query).length === 0 && req.query.constructor === Object)) {
            if(req.query.reportList) {
                report = {
                    idReport: row['id'],
                    company: row['company'],
                    computer: row['serial_number'],
                    user: row['user'],
                    service: row['service'],
                    visit_start_time: row['visit_start_time'],
                    visit_end_time: row['visit_end_time'],
                    description: row['description']
                }
            }
        }

        //Empujamos nuestra fila al arreglo de usuarios
        reports.push(report);

        //Y continuamos con la query
        connection.resume();
        })
        .on('end', function() {
            //Creamos nuestra variable result, la cual sera la que se convertira en nuestra respuesta JSON
            var result;
            //Si obtenemos mas de 1 resultado, regresamos verdadero 
            if(reports.length > 0 ){
                console.log(reports)
                result = { result: true, data: reports}
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
        var query = connection.query(reportQuery + ' WHERE id = ?', [id]);
        //Y creamos nuestra variable donde almacenaremos al objeto seleccionado
        var report: any;
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
        report = {
            idReport: row['id'], 
            computer_id: row['computer_id'],
            company_id: row['company_id'],
            user_id: row['user_id'],
            service_id: row['service_id'],
            visit_start_time: row['visit_start_time'],
            visit_end_time: row['visit_end_time'],
            description: row['description'],
            created_at: row['created_at']
        }

        //Y continuamos con la query
        connection.resume();
        })
        .on('end', function() {
            //Generamos nuestra variable que se convertira en nuestro JSON
            var result;
            //Si nuesto objeto no se define o esta vacio...
            if(report == undefined || report == null){
                //Devolvemos que nuestra busqueda no arrojo resultados
                result = { result: false, data: {}}
                
            }else{
                //caso contrario, regresamos verdadero y nuestro objeto 
                result = { result: true, data: report}
            }
            //Regresamos los resultados de la busqueda
            return res.json(result);
        });
    }

    //Creamos nuestro metodo Async, para que no tengamos que esperar y poder aprovechar los recursos
    public async create(req: Request, res: Response){
        var that = this;
        //Obtenemos la password
        const { computer_id, company_id, user_id, service_id, visit_start_time, visit_end_time, description, created_at } = req.body;

        var report = {
            computer_id: computer_id,
            company_id: company_id,
            user_id: user_id,
            service_id: service_id,
            visit_start_time: visit_start_time,
            visit_end_time: visit_end_time,
            description: description,
            created_at: created_at
        }

        //convertimos nuestro objeto en una query
        var queryreport = connection.escape(report);
        var result;

        //Y hacemos nuestra query tipo pool
        pool.query('INSERT INTO reports SET ' + queryreport , function (error: any, results: any, fields: any) {
            //En caso de tener un error, mandamos el error
            if(error){
                res.json('No company was added ' + error);
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
        const { name , email, lastname } = req.body;

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
export const reportsController = new ReportsController();

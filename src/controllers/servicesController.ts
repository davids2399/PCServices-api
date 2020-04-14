import { Request, Response } from 'express';
//importamos las queries necesarias
import { servicesQuery , serviceQuery } from '../queries';
//Y nuestro metodo para encriptar
import { cryptPassword } from '../encrypt'

import mysql from 'promise-mysql';

//Aqui es donde traemos todo nuestra informacion de la DB
import pool, { connection } from '../database';

class ServicesController{

    //Ya que tenemos que declarar los tipos de variables que estamos obteniendo, utilizamos la libreria de express para declararlos
    public async list (req: Request ,res: Response) {
        //Aqui las cosas se pusieron dificiles....
        //Primeramente creamos nuestra conexion con nuestra query indicada
        var query = connection.query(servicesQuery);
        //Y creamos nuestro arreglo de usuarios
        var services: any[] = [];
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
        var service = {
            idService: row['id'], 
            name: row['name'],
            created_at: row['created_at']
        }

        //Empujamos nuestra fila al arreglo de usuarios
        services.push(service);

        //Y continuamos con la query
        connection.resume();
        })
        .on('end', function() {
            //Creamos nuestra variable result, la cual sera la que se convertira en nuestra respuesta JSON
            var result;
            //Si obtenemos mas de 1 resultado, regresamos verdadero 
            if(services.length > 0 ){
                result = { result: true, data: services}
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
        var query = connection.query(serviceQuery + ' WHERE id = ?', [id]);
        //Y creamos nuestra variable donde almacenaremos al objeto seleccionado
        var service: any;
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
        service = {
            idService: row['id'], 
            name: row['name'],
            created_at: row['created_at']
        }

        //Y continuamos con la query
        connection.resume();
        })
        .on('end', function() {
            //Generamos nuestra variable que se convertira en nuestro JSON
            var result;
            //Si nuesto objeto no se define o esta vacio...
            if(service == undefined || service == null ){
                //Devolvemos que nuestra busqueda no arrojo resultados
                result = { result: false, data: {}}
                
            }else{
                //caso contrario, regresamos verdadero y nuestro objeto 
                result = { result: true, data: service}
            }
            //Regresamos los resultados de la busqueda
            return res.json(result);
        });


    }
}

//Se exporta toda la clase para poder utilizar todos estos metodos
export const servicesController = new ServicesController();

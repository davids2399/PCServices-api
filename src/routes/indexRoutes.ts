import { Router } from 'express';
import { indexController}  from './../controllers/indexController';

class IndexRoutes{
    //Creamos nuestra propiedad de router
    public router: Router = Router();

    constructor(){
        //llamamos a nuestra configuracion
        this.config();
    }

    config(): void{
        //Creamos una ruta inicial para nuestra app. Al iniciar  
        //Aqui hay de 2 sopas, o se pueden establecer las rutas directamente:
        //this.router.get('/',(req,res) => res.send('Hello'));
        //O se puede manejar a traves de un archivo aparte
        this.router.get('/', indexController.index);
    } 

}

//Creamos nuestra constante, que sera la que genere un objeto
const indexRoutes = new IndexRoutes();

//Y la exportamos, pero solamente nuestras rutas
export default indexRoutes.router;
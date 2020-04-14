import { Router } from 'express';
import { servicesController }  from '../controllers/servicesController';

class ServicesRoutes{

    public router: Router = Router();

    constructor(){
        this.config();
    }

    config(): void{
        //Creamos todas nuestras posibles rutas
        //obtiene lista de las compañias
        this.router.get('/', servicesController.list);
        //obtiene una sola compañia
        this.router.get('/:id', servicesController.getOne);
    }

}

//Creamos nuestra constante, que sera la que genere un objeto
const servicesRoutes = new ServicesRoutes();

//Y la exportamos, pero solamente nuestras rutas
export default servicesRoutes.router;
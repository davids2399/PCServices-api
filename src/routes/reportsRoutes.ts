import { Router } from 'express';
import { reportsController }  from '../controllers/reportsController';

class ReportsRoutes{

    public router: Router = Router();

    constructor(){
        this.config();
    }

    config(): void{
        //Creamos todas nuestras posibles rutas
        //obtiene lista de las compañias
        this.router.get('/', reportsController.list);
        //obtiene una sola compañia
        this.router.get('/:id', reportsController.getOne);
        //crea una sola compañia
        this.router.post('/', reportsController.create);
        //elimina una sola compañia
        this.router.delete('/:id',reportsController.delete);
        //actualiza una sola compañia
        this.router.put('/:id', reportsController.update);
    }

}

//Creamos nuestra constante, que sera la que genere un objeto
const reportsRoutes = new ReportsRoutes();

//Y la exportamos, pero solamente nuestras rutas
export default reportsRoutes.router;
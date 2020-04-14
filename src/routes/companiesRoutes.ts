import { Router } from 'express';
import { companiesController }  from '../controllers/companiesController';

class CompaniesRoutes{

    public router: Router = Router();

    constructor(){
        this.config();
    }

    config(): void{
        //Creamos todas nuestras posibles rutas
        //obtiene lista de las compañias
        this.router.get('/', companiesController.list);
        //obtiene una sola compañia
        this.router.get('/:id', companiesController.getOne);
        //crea una sola compañia
        this.router.post('/', companiesController.create);
        //elimina una sola compañia
        this.router.delete('/:id',companiesController.delete);
        //actualiza una sola compañia
        this.router.put('/:id', companiesController.update);
    }

}

//Creamos nuestra constante, que sera la que genere un objeto
const companiesRoutes = new CompaniesRoutes();

//Y la exportamos, pero solamente nuestras rutas
export default companiesRoutes.router;
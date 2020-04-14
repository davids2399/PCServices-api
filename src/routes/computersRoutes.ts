import { Router } from 'express';
import { computersController }  from '../controllers/computersController';

class ComputersRoutes{

    public router: Router = Router();

    constructor(){
        this.config();
    }

    config(): void{
        //Creamos todas nuestras posibles rutas
        //obtiene lista de las compañias
        this.router.get('/', computersController.list);
        //obtiene una sola compañia
        this.router.get('/:id', computersController.getOne);
        //crea una sola compañia
        this.router.post('/', computersController.create);
        //elimina una sola compañia
        this.router.delete('/:id',computersController.delete);
        //actualiza una sola compañia
        this.router.put('/:id', computersController.update);
    }

}

//Creamos nuestra constante, que sera la que genere un objeto
const computersRoutes = new ComputersRoutes();

//Y la exportamos, pero solamente nuestras rutas
export default computersRoutes.router;
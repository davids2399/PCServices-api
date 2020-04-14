import { Router } from 'express';
import { usersController}  from '../controllers/usersController';

class UsersRoutes{

    public router: Router = Router();

    constructor(){
        this.config();
    }

    config(): void{
        //Creamos todas nuestras posibles rutas
        //obtiene lista de usuarios
        this.router.get('/', usersController.list);
        //obtiene un solo usuario
        this.router.get('/:id', usersController.getOne);
        //crea uno solo usuario
        this.router.post('/', usersController.create);
        //elimina uno solo usuario
        this.router.delete('/:id',usersController.delete);
        //actualiza un solo usuario
        this.router.put('/:id', usersController.update);
    }

}

//Creamos nuestra constante, que sera la que genere un objeto
const usersRoutes = new UsersRoutes();

//Y la exportamos, pero solamente nuestras rutas
export default usersRoutes.router;
import { Router } from 'express';
import { loginController }  from '../controllers/loginController';

class LoginRoutes{

    public router: Router = Router();

    constructor(){
        this.config();
    }

    config(): void{
        //Creamos todas nuestras posibles rutas
        this.router.post('/', loginController.login);
    }

}

//Creamos nuestra constante, que sera la que genere un objeto
const loginRoutes = new LoginRoutes();

//Y la exportamos, pero solamente nuestras rutas
export default loginRoutes.router;
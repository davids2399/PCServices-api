import { Request, Response } from 'express';

class IndexController{
    //Ruta principal al acceder al api
    public index (req: Request ,res: Response) {
        res.send('');
    } 
}

//Se exporta toda la clase para poder utilizar todos estos metodos
export const indexController = new IndexController();
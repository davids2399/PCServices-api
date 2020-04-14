//Se instala la dependencia de express
import express, { Application } from 'express';

//Igualmente se instala la dependencia de morgan y cors 
import morgan from 'morgan';
import cors from 'cors';

//Rutas que manejara el servidor
import IndexRoutes from './routes/indexRoutes';
import UsersRoutes from './routes/usersRoutes';
import CompaniesRoutes from './routes/companiesRoutes';
import ComputersRoutes from './routes/computersRoutes';
import ReportsRoutes from './routes/reportsRoutes';
import ServicesRoutes from './routes/servicesRoutes';
import LoginRoutes from './routes/loginRoutes';

//Se crea una clase que sera la que realize la logia de nuestro servidor 
class Server{

    public app: Application;

    //Al crear la clase se ejecuta el constructor
    constructor(){
        this.app = express();
        this.config();
        this.routes();
    }

    //Este metodo se encarga de configurar correctamente las propiedades de app: Application
    config(): void{
        try{
            //process.env.PORT: sirve para detectar que puerto es el que funciona con nuestro servidor de la nube
            //3000: es el puerto que nosotros estipulamos para que funcione nuestro servidor
            this.app.set('port', process.env.PORT || 3000);
            /* Morgan nos sirve para poder ver en consola el tipo de peticion que los usuarios hacen al servidor*/
            this.app.use(morgan('dev'));
            //Con esto angular podra pedir los datos a nuestro server
            this.app.use(cors());
            //Este nos permite poder aceptar datos de tipo json de nuestro server
            this.app.use(express.json());
            //en caso de que queramos enviar desde un formato HTML
            this.app.use(express.urlencoded({extended: false}));
        }catch(e){
            console.log(e);
        }
    }

    //Este metodo funciona para obtener las rutas de nuestro servidor
    routes(): void{
        this.app.use(IndexRoutes);
        this.app.use('/api/users', UsersRoutes);
        this.app.use('/api/companies', CompaniesRoutes);
        this.app.use('/api/computers', ComputersRoutes);
        this.app.use('/api/reports', ReportsRoutes);
        this.app.use('/api/services', ServicesRoutes);
        this.app.use('/api/login', LoginRoutes);
    }

    //Este metodo sera el que inicialize nuestro servidor
    start(): void{
        //Su funcion es escuchar en el puerto definido
        this.app.listen(this.app.get('port'), () => {
            //Aqui empieza nuestro servidor
            console.log('Server on port ' + this.app.get('port'));
        });
    }
}

//Se utiliza esta funcion para generar la clase y que devuelva un objeto
const server = new Server();
server.start();
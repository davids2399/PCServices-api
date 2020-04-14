//Este comando se tienen que ejecutar para encender el servidor...
-npm run dev //Ejecuta el codigo de nuestra REST API

//Este comando se ejecuta en caso de que cambiaramos nuestro codigo de nuestra REST api
-npm run build // Convierte nuestro TS en JS

Comandos de instalacion (/homelink-nodeREST)
(NO es necesario ejecutarlos , nuestro package.json se encarga de instalarlos):

- npm i express morgan promise-mysql cors
//Instalamos el framework de Express para NodeJS
//Morgan nos permite ver en consola las solicitudes a la REST api
//promise-mysql nos permite comunicarnos con la base de datos MYSQL
//cors nos permite comunicar 2 servidores (Angular con Node)

- npm i -g typescript 
//Instalamos typescript en nuestra computadora para poder manejar typescript para escribir nuestro codigo

- tsc --init
//Nos crea un archivo de configuracion para TS y le configuramos ES6
//outDir: "./build" // Colocara nuestro codigo de TS convertido a JS dentro de la carpeta build

- npm i nodemon -D
//Creamos una dependencia para desarrollo (-D), la cual nos permite ejecutar el proyecto de javascript en consola

Visual Studio code:
- npm i @types/express @types/morgan @types/cors-D
//Son unas dependendias para desarrollo, que nos permiten hacer que visual studio code pueda ayudarnos con los autocompletados de Typescript


Configuraciones:
 * package.json 
	- "build": "tsc -w" //Es el comando que convertira nuestra carpeta src en TS a nuestra carpeta build en JS, -w permite que este atento a cualquier cambio en los archivos para guardarlos
	- "dev": "nodemon build/index.js" //Este es el comando que correra nuestra REST api




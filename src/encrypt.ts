//Importamos la libreria de bcrypt
var bcrypt = require('bcrypt');
//Exportamos una funcion que sera la que se encargue de encriptar las contraseñas
export var cryptPassword = function(password: any, callback: any){
    bcrypt.genSalt(10, function(err: any, salt: any) {
        if (err) 
        return callback(err);

        bcrypt.hash(password, salt, function(err: any, hash: any) {
            return callback(err, hash);
        });
    });
}

//Exportamos una funcion que sera la que se encargue de comparar las contraseñas encriptadas
export var comparePassword = function(plainPass: any, hashword: any, callback: any) {
    bcrypt.compare(plainPass, hashword, function(err: any, isPasswordMatch: any) {   
        return err == null ?
            callback(null, isPasswordMatch) :
            callback(err);
    });
};

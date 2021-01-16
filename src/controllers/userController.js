const db = require('../data/db');
const crypt = require('../utils/crypt');
const returns = require('../utils/setReturn');
const Token = require('../utils/jwt');

module.exports = {
    // Create a new user
    async create(request, response) {
        let {name, email, password, confirmPassword, photo} = request.body;
        
        //check if all fields have been filled
        if(name && email && password && confirmPassword) {

            // Search for a user with that email
            let emailAlreadyExists = await db('users').select('*').where("email",email);

            // check if email already exists in database
            if(emailAlreadyExists.length == 0){

                //check if password and confirmPassword are the shame
                if(password == confirmPassword) {

                    // encrypt password
                    let encryptPassword = await crypt.encrypt(password)

                    let user = {
                        name,
                        email,
                        password: encryptPassword,
                        photo:photo
                    }

                    let dbRes = await db('users').insert(user).returning("*")

                    // Generate a Authentication Token
                    let token = Token.generateToken({id:dbRes[0].id});

                    let resUser = {
                        id: dbRes[0].id,
                        name:dbRes[0].name,
                        email:dbRes[0].email,
                        token:'Bearer '+token
                    }
                    return response.json(returns.setReturn("200","Usuario registrado com sucesso",resUser));

                }else{
                    return response.json(returns.setReturn("422","As senhas devem ser iguais!"));
                }

            }else{
                return response.json(returns.setReturn("409","Email já cadastrado"));
            }



        }else{
            return response.json(returns.setReturn("422 ","Todos os campos devem ser preenchidos"));
        }
    },

    // User SignIn
    async login(request, response){

        const {email,password} = request.body;

        //check if all fields have been filled
        if(email && password){

            //check if email is valid
            if(email.indexOf("@") > 0 && email.indexOf(".com") > 0){

                // Search for a user in the database with the given email
                let user = await  db('users').select('*').where("email",email);

                // check if there is a user with that email
                if(user.length > 0){
                    
                    // Check if password is correct
                    if(await crypt.decrypt(password,user[0].password) ){

                        // Generate a Authentication Token
                        let token = Token.generateToken({id:user[0].id});

                        // Return object with user data
                        let responseUser = {
                            id:user[0].id,
                            name:user[0].name,
                            email:user[0].email,
                            photo:user[0].photo,
                            token: 'Bearer ' + token,
                        }

                        return response.json(returns.setReturn("200","ok",responseUser));
                        
                    }else{
                        return response.json(returns.setReturn("422 ","Senha invalida"));
                    }
        
                }else{
                    return response.json(returns.setReturn("404 ","usuario não encontrado"));
                }

            }else{
                return response.json(returns.setReturn("422 ","Email invalido"));
            }

        }else{
            return response.json(returns.setReturn("422 ","Todos os campos são obrigatórios"));  
        } 
    },

    // Forget Password
    async forgetPassword(request,response){
        const {email} = request.body;

        try{
            return response.json(returns.setReturn("200","Email para Alteração enviado"));
        }catch(err){
            return response.json(returns.setReturn("400","Erro ao recuperar senha, tente novamente"));
        }

    },

    // Checks if token is valid
    async refresh(request, response){
        const authToken = Token.validToken(request.headers.authorization);
        if(!authToken.error){
            let obj = {
                token:request.headers.authorization,
                id:authToken.id
            }
            return response.json(returns.setReturn("200","authenticated token",obj));
        }else{   
            return response.json(returns.setReturn("401",authToken.error_msg));
        }

    },


}
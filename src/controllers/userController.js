const db = require('../data/db');
const crypt = require('../utils/crypt');
const returns = require('../utils/setReturn');
const Token = require('../utils/jwt');

module.exports = {
    async create(request, response) {
        let {name, email, password, confirmPassword} = request.body;
        
        //check if all fields have been filled
        if(!name || !email || !password || !confirmPassword) response.json(returns.setReturn("422 ","missing parameter"));

        // Search for a user with that email
        let emailAlreadyExists = await db('users').select('*').where("email",email);

        // check if email already exists in database
        if(emailAlreadyExists.length > 0) response.json(returns.setReturn("409","user already exists"));

        //check if password and confirmPassword are the shame
        if(password !== confirmPassword) response.json(returns.setReturn("422","passwords do not match"));

        // encrypt password
        let encryptPassword = await crypt.encrypt("123")

        let user = {
            name,
            email,
            password: encryptPassword
        }

        let dbRes = await db('users').insert(user).returning("*")

        // Generate a Authentication Token
        let token = Token.generateToken({id:dbRes[0].id});

        let resUser = {
            id: dbRes[0].id,
            name:dbRes[0].name,
            email:dbRes[0].email,
            token:token
        }
        return response.json(returns.setReturn("200","user successfully registered",resUser));
    },

    async delete(request,response){
        const {id} = request.body;

        let user = await db('users').where('id',id).returning('*').del()

        // check if there is a user with that email
        if(!user.length) response.json(returns.setReturn("404 ","User not found"));

        return response.json(returns.setReturn("200","deleted",{id: user[0].id}));
    },

    async login(request, response){

        const {email,password} = request.body;

        // Check if Token is Valid
        const authToken = Token.validToken(request.headers.authorization);
        if(authToken.error) response.json(returns.setReturn("401",authToken.error_msg));
        
        //check if all fields have been filled
        if(!email || !password) response.json(returns.setReturn("422 ","missing parameter"));

        //check if email is valid
        if(email.indexOf("@") < 0 || email.indexOf(".com") < 0) response.json(returns.setReturn("422 ","Invalid email"));

        // Search for a user in the database with the given email
        let user = await  db('users').select('*').where("email",email);

        // check if there is a user with that email
        if(!user.length) response.json(returns.setReturn("404 ","User not found"));

        // Check if password is correct
        if(!await crypt.decrypt(password,user[0].password) ) response.json(returns.setReturn("422 ","Invalid Password"));

        // Generate a Authentication Token
        let token = Token.generateToken({id:user[0].id});

        // Return object with user data
        let responseUser = {
            id:user[0].id,
            name:user[0].name,
            email:user[0].email,
            token:token
        }

        return response.json(returns.setReturn("200","ok",responseUser));

    },

}
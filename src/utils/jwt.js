const jwt = require('jsonwebtoken');
require('dotenv').config();

const returns = require('./setReturn');

module.exports = {

    generateToken(params = {}){
        const token = jwt.sign(
            {
                id:params.id
            },
            process.env.JWT_KEY,
            {
                expiresIn: 86400
            }
        );

        return token;
    },

    validToken(authHeader = null){
        
        if(!authHeader){
            return {error:true,error_msg:"No token provided"}
        }
    
        const parts = authHeader.split(' ');
    
        if(!parts.length === 2){
            return {error:true,error_msg:"Token error"}
        }
    
        const [scheme,token] = parts;

        if(scheme.indexOf('Bearer') < 0){
            return {error:true,error_msg:"Token malformatted"}
        }
        
        let error = false;
        let id;
        jwt.verify(token, process.env.JWT_KEY,(err,decoded) => {
            if(err){
                error = true;
            }else{
                id = decoded.id
            }
        });

        if(error){
            return {error:true,error_msg:"Token invalid"}
        }else{
            return {error:false,id:id}
        }

    }

}
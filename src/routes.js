const { Router } = require('express');
const userController = require('./controllers/userController');


const routes = Router();
    routes.get('/user/login', (request, response) => {
        response.send({"msg":"ok"})
    });

    routes.post('/user/create',userController.create);
    routes.post('/user/delete',userController.delete);
    routes.post('/user/login',userController.login);

module.exports = routes;
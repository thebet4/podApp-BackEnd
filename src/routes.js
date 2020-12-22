const { Router } = require('express');
const userController = require('./controllers/userController');


const routes = Router();
    routes.get('/', (request, response) => {
        response.send({"msg":"ok"})
    });
    routes.get('/user/refresh',userController.refresh);

    routes.post('/user/create',userController.create);
    routes.post('/user/delete',userController.delete);
    routes.post('/user/login',userController.login);


module.exports = routes;
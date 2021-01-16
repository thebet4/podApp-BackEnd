const express = require("express")
const routes = require('./routes')

const app = express()

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE")
    next();
  });

app.use(express.json({limit: '50mb'}))
app.use(routes)

const port = process.env.PORT || 3333
app.listen(port, ()=>{console.log(`server is running in http://localhost:${port}`)});
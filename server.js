// import
const http = require('http');
const app = require('./app')
// provide port for runnning server
const port = process.env.port || 3000;
// create server
const server = http.createServer(app);
// listem to port 
server.listen(port);
// import
const http = require('http');
const app = require('./app')
// provide port for runnning server
const port = process.env.port || 3000;
// create server
const server = http.createServer(app);
// for chat server
var io = require('socket.io').listen(server);

io.on('connection', (socket) => {
    console.log("socket open")
    socket.on('new_joinee', (data) => {
        console.log(data)
        socket.join(data.room);
        socket.in(data.room).broadcast.emit('server_new_joinee', {
            message: data.name + ' successfully joined room ' + data.room,
            userJoined: {
                name: data.name,
                room: data.room
            },
            date: new Date()
        });
    })

    socket.on('clent_new_msg', (data) => {
        socket.in(data.room).broadcast.emit('server_new_msg', {
            message: data.message,
            userJoined: {
                name: data.name,
                room: data.room
            },
            date: new Date()
        });
    })

    socket.on('disconnect', (data) => {
        socket.in(data.room).broadcast.emit('users-left', {
            message: data.message
        });
    });


})

// server.listen(3000, () => {
//     console.log("chat server");
// })

// listem to port 
server.listen(port);
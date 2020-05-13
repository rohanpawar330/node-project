// var express = require('express');
// const server = require('../../server');
// var app = express();
// var serverChat = app.listen(3000);
// var app = express();
// var http = require('http');
// var server = http.createServer(app);
// const router = express.Router()


module.exports.listen = function (app) {
    var io = require('socket.io').listen(app);
    console.log("chat server");
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
            // console.log('clent_new_msg', data)
            socket.in(data.room).broadcast.emit('server_new_msg', {
                message: data.msg,
                userJoined: {
                    name: data.name,
                    room: data.room
                },
                date: new Date()
            });
        })

    })
    return io
}



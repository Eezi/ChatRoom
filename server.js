const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');
let users = [];
let messages = [];
let index = 0;

mongoose.connect("mongodb://localhost:27017/vue_fullstack");

const ChatSchema = mongoose.Schema({
    username: String,
    msg: String
});

const ChatModel = mongoose.model("chat", ChatSchema);

ChatModel.find((err, result) => {
    if(err) throw err;

    messages = result;
})

//Event listener
io.on("connection", socket => {
    socket.emit('loggedin', {
        users: users.map(s => s.username),
        messages: messages
    });

    socket.on('newuser', username => {
        console.log(`${username} has arrived at the pary.`)
        socket.username = username;
        users.push(username);

        io.emit('userOnline', socket.username);
    });

    socket.on('msg', msg => {
        let message = {
            index: index,
            username: socket.username,
            msg: msg
        }

        messages.push(message);

        io.emit('msg', message);

        index++;
    })

    
    //Discconnect
    socket.on("disconnect", () => {
        console.log(`${socket.username} has left the party.`);
        io.emit('userLeft', socket.username);
        users.splice(users.indexOf(socket), 1);
    })
})

http.listen(process.env.PORT || 3000, () => {
    console.log("Listening on port ", process.env.PORT || 3000);
})


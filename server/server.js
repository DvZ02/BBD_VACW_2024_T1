const express = require('express');
const socketio = require('socket.io');
require('dotenv').config();


const PORT = process.env.PORT || 8000;

const app = express();

app.use(express.json());
app.use(express.static('../client/main'));

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

const io = socketio(server);

io.on('connection',  (socket) => {
    console.log('New client connected');

    //Most socket logic here
});
const { parse, populate } = require('dotenv');
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
let ballX=0, ballY=0, ballZ=0;
let playersSession=[]; // For now this is a 2D array which contains the usernames for the current game session
let sessionName="admin";
let playersDB = []

let colors = ["blue", "pink", "green", "orange"]

io.on('connection',  (socket) => {
    console.log('Client connected to website');

    /**
     * Used to update the current ball movement speed. The speed is based on the cumulative constributions of all the playersSession
     * Param: Expects a struct containing the playerUsername, the x, y and x attributes of the playersSession gyroscope
     */
    socket.on("UpdateBall", (data) => {
        let clientGyroParams = JSON.parse(data);
        //UpdateBallCalculations
        ballX += clientGyroParams.x;
        ballY += clientGyroParams.y;
        ballZ += clientGyroParams.z;
        console.log(clientGyroParams.playerUsername);
    });

    /**
     * Used to create a new session
     * Param: Expects a struct which has the playerUsername
     * Emits RequestPermissionToHostResult event handler which is a struct with the result for "Denied" and "Granted" 
     */
    socket.on("RequestPermissionToHost", (data) =>{
        console.log("Debug");
        if(playersSession.length != 0){
            socket.emit("RequestPermissionToHostResult", JSON.stringify({
                result:"Denied"
            }));
        }
        else{
            let player = JSON.parse(data);
            let playerAssignedColor = colors[playersSession.length];
            playersSession.push(player.playerUsername);
            sessionName = player.sessionNameToCreate;
            socket.emit("RequestPermissionToHostResult", JSON.stringify({
                result:"Granted",
                playerColor:playerAssignedColor
            }));
        }
    });

    /**
     * Used to request permission join a session
     * Param: Expects a struct which has the playerUsername
     * Emits RequestPermissionToJoinResult event handler which is a struct with the result for "Denied" and "Granted" 
     */
    socket.on("RequestPermissionToJoin", (data) =>{
        let player = JSON.parse(data);
        if(playersSession.length === 0 || playersSession.length===4 || playersSession.includes(player.playerUsername) || player.sessionNameToJoin!==sessionName){
            socket.emit("RequestPermissionToJoinResult", JSON.stringify({
                result:"Denied"
            }));
        }
        else{
            let player = JSON.parse(data);
            let playerAssignedColor = colors[playersSession.length];
            playersSession.push(player.playerUsername);
            sessionName = player.sessionNameToJoin;
            socket.emit("RequestPermissionToJoinResult", JSON.stringify({
                result:"Granted",
                playerColor:playerAssignedColor
            }));
        }
    });

    /**
     * Used to request permission to create an account
     * Param: Expects a struct which has the playerUsername
     * Emits RequestSignUpResult event handler which is a struct with the result for "Denied" and "Granted" 
     */
    socket.on("RequestSignUp",(data) =>{
        let playerToAdd = JSON.parse(data);
        console.log(playerToAdd.playerUsername);
        if(playersDB.includes(playerToAdd.playerUsername)){
            socket.emit("RequestSignUpResult", JSON.stringify({
                result:false, 
                message: "Denied"
            }));
        }
        else{
            playersDB.push(playerToAdd.playerUsername); 
            socket.emit("RequestSignUpResult", JSON.stringify({result:true, message: "Granted"}));
            socket.broadcast.emit("PlayerJoinded", JSON.stringify({
                player: playerToAdd.playerUsername, 
                color: colors[playersDB.length-1]
            })); 
        }
    });
    //Most socket logic here
});
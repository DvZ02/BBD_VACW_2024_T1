const { parse, populate } = require('dotenv');
const express = require('express');
const socketio = require('socket.io');
require('dotenv').config();


const PORT = process.env.PORT || 8000;

const app = express();

app.use(express.json());
app.use(express.static('../client'));

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
    funThreshold = Math.floor(Math.random() * 10000);
    console.log(funThreshold);   
});

const io = socketio(server);
let ballX=0, ballY=0, ballZ=0;
let playersSession=[]; // For now this is a 2D array which contains the usernames for the current game session
let playersDB = []

let colors = ["green", "blue", "orange", "pink"]

let funThreshold = 0;
let funCounter = 0;

io.on('connection',  (socket) => {
    console.log('New client connected');

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
        if(playersSession.length != 0){
            socket.emit("RequestPermissionToHostResult", JSON.stringify({result:"Denied"}));
        }
        else{
            let player = JSON.parse(data);
            playersSession.push(player.playerUsername);
            socket.emit("RequestPermissionToHostResult", JSON.stringify({result:"Granted"}));
        }
    });

    /**
     * Used to request permission join a session
     * Param: Expects a struct which has the playerUsername
     * Emits RequestPermissionToJoinResult event handler which is a struct with the result for "Denied" and "Granted" 
     */
    socket.on("RequestPermissionToJoin", (data) =>{
        let player = JSON.parse(data);
        if(playersSession.length === 0 || playersSession.length===4 || playersSession.includes(player.playerUsername)){
            socket.emit("RequestPermissionToJoinResult", JSON.stringify({result:"Denied"}));
        }
        else{
            playersSession.push(player.playerUsername);
            socket.emit("RequestPermissionToJoinResult", JSON.stringify({result:"Granted"}));
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

        if(playerToAdd.playerUsername.length > 15){
            playerToAdd.playerUsername = "Rudolph"
        }

        if(playersDB.includes(playerToAdd.playerUsername) || playersDB.length === 4){ //Maybe add a emit for when full
            socket.emit("RequestSignUpResult", JSON.stringify({
                result:false, 
                message: "Denied"
            }));
        }
        else{
            let player = {
                playerUsername: playerToAdd.playerUsername,
                score: 0,
                contribution: 0,
                color: colors[playersDB.length]
            }
            playersDB.push(player); 
            socket.emit("RequestSignUpResult", JSON.stringify({result:true, message: "Granted"}));
            socket.broadcast.emit("PlayerJoinded", JSON.stringify({
                player: playerToAdd.playerUsername, 
                color: colors[playersDB.length-1]
            }));  
        }
    });

    socket.on("StartGame", () =>{
        socket.broadcast.emit("GameStarted", JSON.stringify({players: playersDB}));
    });

    socket.on("RequestPlayers", () =>{
        socket.emit("PlayingPlayers", JSON.stringify({players: playersDB}));
    }); 

    socket.on("GyroData", (data) =>{
        // let gyroData = JSON.parse(data);
        funCounter++;
        if(funCounter >= funThreshold){
            io.emit("Fun");
            funCounter = 0;
        }

        playersDB.forEach(player => {
            if(player.playerUsername == data.user){
                if(data.norm.x === 0 ){
                    player.contribution = 90;
                }else{
                    player.contribution = Math.round(Math.atan2(data.norm.y,data.norm.x) * 180 / Math.PI);
                }
            }
            // console.log(data.norm)
            // console.log(player.playerUsername + " " + player.contribution);
        });
        socket.broadcast.emit("MoveBall", data.norm);
    });
    socket.on("ReachedHole", (data)=>{
        io.emit("GameOver", data);
        playersDB = [];
    })

    socket.on("BallDistance", (data) =>{
        // console.log(playersDB[data.player]);
        playersDB[data.player].score = Math.round(data.distance, 2);
    });
});
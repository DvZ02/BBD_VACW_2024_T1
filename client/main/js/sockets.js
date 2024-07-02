const socket = new io('http://localhost:8000');

let username = "PlayerOne"; //ToDO. Request Username; 

socket.emit("RequestSignUp",JSON.stringify({playerUsername:username}));

socket.on("RequestSignUpResult", (data) =>{
    let serverResponse = JSON.parse(data);
    console.log("RequestSignUp "+serverResponse.result);
});

socket.emit("RequestPermissionToHost",JSON.stringify({playerUsername:username}));

socket.on("RequestPermissionToHostResult", (data) =>{
    let serverResponse = JSON.parse(data);
    console.log("RequestPermissionToHost "+serverResponse.result);
});

socket.emit("RequestPermissionToJoin",JSON.stringify({playerUsername:username}));

socket.on("RequestPermissionToJoinResult", (data) =>{
    let serverResponse = JSON.parse(data);
    console.log("RequestPermissionToJoin "+serverResponse.result);
});

socket.emit("UpdateBall",JSON.stringify({playerUsername:username, x:1, y:2, z:3}));//ToDO. pass in gyro struct

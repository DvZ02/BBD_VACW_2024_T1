const socket = new io('http://localhost:8000');

function signup(){
    let username = document.getElementById("username").value;
    // console.log(username);
    socket.emit("RequestSignUp",JSON.stringify({playerUsername:username}));

    socket.on("RequestSignUpResult", (data) =>{
        let serverResponse = JSON.parse(data);
        alert(serverResponse.result);
    });
}
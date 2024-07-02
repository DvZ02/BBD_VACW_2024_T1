const socket = new io('http://localhost:8000');
let playerUsernameOnSignUp; 

async function signup(){
    let username = document.getElementById("username").value;
    // console.log(username);
    socket.emit("RequestSignUp",JSON.stringify({playerUsername:username}));

    await socket.on("RequestSignUpResult", async (data) =>{
        let serverResponse = JSON.parse(data);
        if(serverResponse.result){
            playerUsername=username;
            window.location.href = "lobby.html";
        }
        else{
            alert("Username taken");
        }
    });
}
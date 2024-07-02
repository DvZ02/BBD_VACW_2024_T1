const socket = new io('https://tilt-3596.onrender.com');

async function signup(){
    let username = document.getElementById("username").value;
    // console.log(username);
    socket.emit("RequestSignUp",JSON.stringify({playerUsername:username}));

    await socket.on("RequestSignUpResult", async (data) =>{
        let serverResponse = JSON.parse(data);
        if(serverResponse.result){
            // window.location.href = "lobby.html";
        }
    });
}
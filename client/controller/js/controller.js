const socket = new io('https://tilt-3596.onrender.com');

function signup(){
    let username = document.getElementById("username").value;
    // console.log(username);
    socket.emit("RequestSignUp",JSON.stringify({playerUsername:username}));

    socket.on("RequestSignUpResult", async (data) =>{
        let serverResponse = JSON.parse(data);
        if(serverResponse.result){
            // window.location.href = "lobby.html";
            username.value = "";
            document.getElementsByClassName("waiting").style.display = "block";
        }
    });
}
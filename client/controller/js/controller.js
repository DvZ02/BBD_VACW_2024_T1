const socket = new io('https://tilt-3596.onrender.com');
// const socket = new io('http://localhost:8000');


function signup(){
    let username = document.getElementById("username").value;
    // console.log(username);
    socket.emit("RequestSignUp",JSON.stringify({playerUsername:username}));

    socket.on("RequestSignUpResult", async (data) =>{
        let serverResponse = JSON.parse(data);
        if(serverResponse.result){
            // window.location.href = "lobby.html";
            sessionStorage.setItem("username", username);
            document.getElementById("join").style.display = "none";
            document.getElementsByClassName("waiting")[0].style.display = "block";
        }else{
            alert("Username already taken or game is full");
        }
    });
}

socket.on('GameStarted', (players) =>{
    let playersList = JSON.parse(players);
    let username = sessionStorage.getItem("username");
    playersList.players.forEach(player => {
        if(player.playerUsername === username){
            window.location.href = "./gyro.html";

            // sessionStorage.setItem("color", player.color);
        }
    });
});
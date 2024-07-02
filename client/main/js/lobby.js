const socket = new io('http://localhost:8000');

socket.on("PlayerJoinded", (data) =>{
    let player = JSON.parse(data);
    console.log(player);
    const playerElement = document.createElement("p");
    playerElement.innerHTML = player.player;
    
    let color;
    switch(player.color){
        case "pink":
            color = "#DE13C9";
            break;
        case "blue":
            color = "#20CAFF";
            break;
        case "green":
            color = "#12F436";
            break;
        case "orange":
            color = "#FB8F10";
            break;
    };
    playerElement.style.color = color;
    document.getElementById("players").appendChild(playerElement);
});

function hostSession(){

    let sessionName = document.getElementById("sessionName").value;
    alert("DEBUG");
    socket.emit("RequestPermissionToHost", JSON.stringify({
        playerUsername:username,
        sessionNameToCreate:sessionName
    }));
    socket.on("RequestPermissionToHostResult", (data) =>{
        let serverResponse = JSON.parse(data);
        if(serverResponse.result === "Denied"){
            // window.location.href = "lobby.html";
            alert("Already at maxmimum session capacity"); // For now we only allow one session
        }
    });
}

function joinSession(){
    let sessionName = document.getElementById("sessionName").value;
    socket.emit("RequestPermissionToJoin", JSON.stringify({
        playerUsername:playerUsernameOnSignUp,
        sessionNameToJoin: sessionName
    }));
    socket.on("RequestPermissionToHostResult", (data) =>{
        let serverResponse = JSON.parse(data);
        if(serverResponse.result === "Denied"){
            // window.location.href = "lobby.html";
            alert("Already at maxmimum session capacity"); // For now we only allow one session
        }
        else{
            document.getElementById("HostOrJoinOptions").remove();
            socket.emit("PlayerJoined", {
                playerUsername: playerUsernameOnSignUp,
                color:serverResponse.playerColor
            });
        }
    });
}
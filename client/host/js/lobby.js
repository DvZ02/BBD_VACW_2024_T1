const socket = new io('https://tilt-3596.onrender.com');

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

function startGame(){
    // socket.emit("StartGame");
    window.location.href = "serverGame.html";
}
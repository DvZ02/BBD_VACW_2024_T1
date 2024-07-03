// const socket = new io('https://tilt-3596.onrender.com');
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

function startGame(){
    countdown(6);
    setTimeout(() => {
        window.location.href = "serverGame.html";
        socket.emit("StartGame");
    }, 6000);
    // socket.emit("StartGame");
    // window.location.href = "serverGame.html";
}

function countdown(start){
    let timer = setInterval(() => {
        document.getElementById("timer-container").style.display = "block";
        // window.location.href = "serverGame.html";
        start--;
        document.getElementById("timer").innerHTML = start;
        if(start === 0){
            document.getElementById("timer-container").style.display = "none";
            clearInterval(timer);
        }
    }, 1000);
}
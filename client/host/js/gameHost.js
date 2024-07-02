// const socket = new io('https://tilt-3596.onrender.com');
const socket = new io('http://localhost:8000');

socket.emit("RequestPlayers");

socket.on("PlayingPlayers", (players) => {
    console.log(players);
});
const socket = new io('https://tilt-3596.onrender.com:8000');

document.getElementById("winner").style.color = sessionStorage.getItem("color");
document.getElementById("winner").innerHTML = sessionStorage.getItem("winner") + " won!";

socket.on("FunGod", (funGod) => {
    document.getElementById("funGod").innerHTML = funGod +" had more fun!!";
});

function joinAgain(){
    window.location.href = "lobby.html";
}
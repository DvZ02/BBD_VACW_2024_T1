document.getElementById("winnerName").style.color = sessionStorage.getItem("color");
document.getElementById("winner").innerHTML = sessionStorage.getItem("winner") + " won!";

function joinAgain(){
    window.location.href = "lobby.html";
}
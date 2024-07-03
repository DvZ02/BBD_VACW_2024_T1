document.getElementById("winnerName").style.color = sessionStorage.getItem("color");
document.getElementById("winnerName").innerHTML = sessionStorage.getItem("winner") + " won!";

function joinAgain(){
    window.location.href = "controller.html";
}
document.getElementById("winnerName").innerHTML = sessionStorage.getItem("winner") + " won!";

function joinAgain(){
    window.location.href = "controller.html";
}
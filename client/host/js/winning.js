document.getElementById("winner").innerHTML = sessionStorage.getItem("winner") + " won!";

function joinAgain(){
    window.location.href = "lobby.html";
}
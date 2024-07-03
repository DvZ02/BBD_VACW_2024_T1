const socket = new io('https://tilt-3596.onrender.com');
// const socket = new io('http://localhost:8000');

socket.emit("RequestPlayers");


socket.on("PlayingPlayers", (players) => {
    let playersList = JSON.parse(players);
    const playerTable = document.getElementById("players");

    playersList.players.forEach(player => {
        const row = document.createElement("tr");
        const username = document.createElement("td");
        const score = document.createElement("td");
        const contribution = document.createElement("td");

        username.innerHTML = player.playerUsername;
        score.innerHTML = player.score;
        contribution.innerHTML = player.contribution;

        let color;
        switch(player.color){
            case "pink":
                color = "#DE13C9";
                break;
            case "blue":
                color = "#20CAFF";
                break;
            case "green":
                color = "#11F436";
                break;
            case "orange":
                color = "#FB8F10";
                break;
        };
        row.style.color = color;
        row.appendChild(username);
        row.appendChild(score);
        row.appendChild(contribution);
        playerTable.appendChild(row);
    });
});
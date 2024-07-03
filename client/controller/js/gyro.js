// const socket = new io('https://tilt-3596.onrender.com');
const socket = new io('http://localhost:8000');

socket.emit("RequestPlayers");

socket.on("GameOver", (winner) => {
  console.log(winner);
  // alert("Game over");
  // window.location.href = "gameOver.html";
});

socket.on("PlayingPlayers", (players) =>{
  let playerList = JSON.parse(players);
  playerList.players.forEach(player => {
    if(player.playerUsername === sessionStorage.getItem("username")){

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

      document.getElementById("username").innerHTML = player.playerUsername;
      document.getElementById("username").style.color = color;
      

      
      let gyroPin = document.getElementsByClassName("face");
      for(let i = 0; i < gyroPin.length; i++){
        gyroPin[i].style.backgroundColor = color;
      }
    }
  });
});

//get the direction display elements
const xOutput = document.getElementById("xCoOrd");
const yOutput = document.getElementById("yCoOrd");
const magOutput = document.getElementById("magnitude");

//get the canvas
/*
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
let canvasWidth = 0;*/

function getOrientation() {
    const rawData = getPhoneData()

    console.log(rawData)

    //display the data
    /*
    x.innnerText = rawData.x
    y.innnerText = rawData.y
    z.innnerText = rawData.z
    */

    const x = document.getElementById("xCoOrd").innerText = rawData.x;
    const y = document.getElementById("yCoOrd").innerText = rawData.y;
    const z = document.getElementById("zCoOrd").innerText = rawData.z;
}

function getPhoneData() {

    const data = {
        x: 0,
        y: 50,
        z: 0
    }

    return data;
}

//getOrientation()
function run() {

    //get the direction display elements
    const xOutput = document.getElementById("xCoOrd");
    const yOutput = document.getElementById("yCoOrd");
    const magOutput = document.getElementById("magnitude");
    const info = document.getElementById("info");

    info.innerText = "Running";

    //check if the device support gyro
    
    /*let gyroscope = new Gyroscope( {frequency: 1} );
    info.innerText = "gyro initialised";
    */

    //check that the device has a gyroscope
    /*
    let sensor = new Gyroscope();
    let x,y,z;

    //start the sensor
    sensor.start();
    
    sensor.onreading = () => {
        let gyroX = sensor.x;
        let gyroY = sensor.y;

        let xNorm = 0.0;
        let yNorm = 0.0;

        let magnitude = 1;

        if (gyroX == 0.0) {
            xNorm = 0.0;
            yNorm = 1.0;
        } else if (gyroY == 0.0) {
            yNorm = 0.0;
            xNorm = 1.0;
        } else {
            let magnitude = Math.sqrt((gyroX * gyroX) + (gyroY * gyroY));
            xNorm = gyroX / magnitude;
            yNorm = gyroY / magnitude;    
        }

        xOutput.innerText = xNorm;
        yOutput.innerText = yNorm;
        magOutput.innerText = magnitude;

        //updateScreen(xNorm, yNorm);
        handleRotate(xNorm, yNorm);

        let norm = {
            x: xNorm,
            y: yNorm
        }

        socket.emit("gyroData", norm);
    }
    */

    //handle the normal people
    window.addEventListener('deviceorientation', (event) => {

        let gyroX = event.gamma;
        let gyroY = event.beta;

        const yNorm = gyroY / 180;
        const xNorm = gyroX / 90;
        
        /*
        let xNorm = 0.0;
        let yNorm = 0.0;

        let magnitude = 1;

        if (gyroX == 0 && gyroY == 0) {
            xNorm = 0.0;
            yNorm = 0.0;
        } else if (gyroX == 0.0) {
            xNorm = 0.0;
            yNorm = 1.0;
        } else if (gyroY == 0.0) {
            yNorm = 0.0;
            xNorm = 1.0;
        } else {
            magnitude = Math.sqrt((gyroX * gyroX) + (gyroY * gyroY));
            xNorm = gyroX / magnitude;
            yNorm = gyroY / magnitude;    
        }

        xOutput.innerText = xNorm;
        yOutput.innerText = yNorm;
        magOutput.innerText = magnitude;
        */
        //updateScreen(xNorm, yNorm);
        handleRotate(xNorm, yNorm);

        let norm = {
            x: xNorm,
            y: yNorm
        }

        socket.emit("GyroData", norm);

        return norm;

    }, true)
}

var sphere = document.querySelector('.sphere'),
    spherePerspective = document.querySelector('.sphere-perspective'),
    followElement = document.querySelector('.follow'),
    xvis = document.querySelector('.xvis'),
    yvis = document.querySelector('.yvis'),
    pvis = document.querySelector('.perspective'),
    loveit = document.querySelector('.loveit'),
    follow = true,
    perspective = 2000;

var xdeg,xdegstring,ydeg,ydegstring;

function handleRotate(xRotate, yRotate){
    
    xdeg = -180 * (xRotate + 1) / 2;
    ydeg = 180 * (yRotate + 1) / 2;
    xdegstring = xdeg + 'deg';
    ydegstring = ydeg + 'deg';
    
    xvis.innerHTML = xdegstring;
    yvis.innerHTML = ydegstring;
    
    sphere.prefixedStyle('transform','rotateY('+xdegstring+') rotateX('+ydegstring+')');
    
    if(Math.abs(xdeg) < 36 && ydeg < 126 && ydeg > 54){
        loveit.className = 'loveit show';
    }else{
        loveit.className = 'loveit';  
    }
}


Element.prototype.prefixedStyle = function(p,style){
  var prefixes = ['webkit','moz','o'],
      i = 0;
  p = p.charAt(0).toUpperCase() + p.slice(1);
  while (Element.prefix = prefixes[i++]){
    this.style[Element.prefix + p] = style;
  }
};



run();
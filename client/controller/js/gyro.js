// const socket = new io('https://tilt-3596.onrender.com');
const socket = new io('http://localhost:8000');

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

    //handle the normal people
    window.addEventListener('deviceorientation', (event) => {

        let gyroX = event.alpha * 2;
        let gyroY = event.gamma * 2;

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

        return norm;

    })

    /*
    navigator.permissions.query({ name: "gyroscope" }).then((result) => {
        if (result.state === "denied") {
        info.innerText = "Permission to use gryroscope sensor is denied.";
        return;
        }
        // Use the sensor.
        
    });

    gyroscope.start();*/
}
/*
function initializeCanvas() {
    //get the windows width
    canvasWidth = window.innerWidth / 2;
    
    //set the canvas size
    context.canvas.width = canvasWidth;
    context.canvas.height = canvasWidth; 
}

function updateScreen(xVal, yVal) {

    //calculate the origin
    let x0 = canvasWidth / 2;
    let y0 = canvasWidth / 2;

    //calaculate the distances
    let xEnd = Math.round(xVal * (x0) + x0);
    let yEnd = Math.round(-yVal * (y0) + y0);

    //draw the line
    context.fillStyle = '#ff0303';

    context.moveTo(x0, y0);
    context.lineTo(xEnd, yEnd);
    context.stroke();


}*/

//initializeCanvas();
//updateScreen(.9, .05)
var sphere = document.querySelector('.sphere'),
    spherePerspective = document.querySelector('.sphere-perspective'),
    followElement = document.querySelector('.follow'),
    xvis = document.querySelector('.xvis'),
    yvis = document.querySelector('.yvis'),
    pvis = document.querySelector('.perspective'),
    loveit = document.querySelector('.loveit'),
    follow = true,
    perspective = 2000;

//document.body.onmousemove = handleRotate;
/*
document.addEventListener('onmousemove', handleRotate);

window.onkeydown = function(e){
  if(e.which === 70){
    follow = !follow;
  }
  followElement.checked = !followElement.checked;
};

followElement.onchange = function(e){
  console.log(e);
  if(e.target.checked)
    follow = true;
  else
    follow = false;  
};*/

var xdeg,xdegstring,ydeg,ydegstring;
/*
function handleRotate(e){
    document.getElementById('info').innerText = 'Rotation:  ' + e;
  if(follow){
    xdeg = -360 * e.x / document.body.clientWidth + 180;
    ydeg = 360 * e.y / document.body.clientHeight + 90;
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
}*/

function handleRotate(xRotate, yRotate){

    //swap x and y because screen will be landscape
    let xVal = yRotate;
    let yVal = xRotate;

    xdeg = -180 * xVal;
    ydeg = 180 * yVal;
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
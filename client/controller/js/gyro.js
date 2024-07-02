
//get the direction display elements
const xOutput = document.getElementById("xCoOrd");
const yOutput = document.getElementById("yCoOrd");
const magOutput = document.getElementById("magnitude");

//get the canvas
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
let canvasWidth = 0;

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

        let gyroX = event.alpha;
        let gyroY = event.beta;

        let xNorm = 0.0;
        let yNorm = 0.0;

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

        updateScreen(xNorm, yNorm);

        let norm = {
            x: xNorm,
            y: yNorm
        }

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


}

initializeCanvas();
updateScreen(.9, .05)


//run();
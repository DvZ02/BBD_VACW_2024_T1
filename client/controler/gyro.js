
//get the direction display elements
const xOutput = document.getElementById("xCoOrd");
const yOutput = document.getElementById("yCoOrd");
const zOutput = document.getElementById("zCoOrd");

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
    const zOutput = document.getElementById("zCoOrd");
    const info = document.getElementById("info");

    info.innerText = "Running";

    //check if the device support gyro
    
    let gyro = new Gyroscope( {frequency: 60} );
    info.innerText = "gyro initialised";


    navigator.permissions.query({ name: "gyroscope" }).then((result) => {
        if (result.state === "denied") {
        info.innerText = "Permission to use gryroscope sensor is denied.";
        return;
        }
        // Use the sensor.
        
    });

    gyroscope.addEventListener("reading", (e) => {
        xOutput.innerText = `Angular velocity along the X-axis ${gyroscope.x}`;
        yOutput.innerText = `Angular velocity along the Y-axis ${gyroscope.y}`;
        zOutput.innerText = `Angular velocity along the Z-axis ${gyroscope.z}`;
    });
    gyroscope.start();
    /*
    let gyroscope = null;
    
    try {
        gyroscope = new GyroScope({ referenceFrame: "device" });
        gyroscope.addEventListener("error", (event) => {
        // Handle runtime errors.
        if (event.error.name === "NotAllowedError") {
            // Branch to code for requesting permission.
        } else if (event.error.name === "NotReadableError") {
            showMessage("Cannot connect to the sensor.");
        }
        });
        gyroscope.addEventListener("reading", () => reloadOnShake(gyroscope));
        gyroscope.start();
    } catch (error) {
    
        // Handle construction errors.
        if (error.name === "SecurityError") {
        // See the note above about permissions policy.
        info.innerText = "Sensor construction was blocked by a permissions policy.";
        } else if (error.name === "ReferenceError") {
        info.innerText = "Sensor is not supported by the User Agent.";
        } else {
            info.innerText = error.name;
        throw error;
        }
    }
    */
}

run();

/*
function updateGyro() {

}



function getAccel() {
    //console.log("permissions button pressed");
    if (typeof DeviceMotionEvent.requestPermission === "function") {
      DeviceMotionEvent.requestPermission()
        .then((response) => {
          if (response == "granted") {
            window.addEventListener("devicemotion", (event) => {
              // do something with event
              xOutput.innerHTML = event.acceleration.x.toFixed(2);
              yOutput.innerHTML = event.acceleration.y.toFixed(2);
              zOutput.innerHTML = event.acceleration.z.toFixed(2);
              // updateState.innerHTML = "Started motion sensing";
  
            });
          }
        })
        .catch(console.error);
      //return (acc_magnitude);
      //alert_disqualify(acc_magnitude);
    } else {
      // alert_disqualify(updateReadings())
      // non iOS 13+
      //updateReadings();
      gyro = new GyroScope({ frequency: 60 });
      gyro.addEventListener("reading", () => {
        xOutput.innerHTML = gyro.x;
        yOutput.innerHTML = gyro.y;
        zOutput.innerHTML = gyro.z;
      });
      gyro.start();
    }
}
  
// function setAcc(){
//   custAcc = document.getElementById("customAcc").value;
//   console.log("Acc set to " + custAcc);
// }
navigator.permissions.query({ name: "accelerometer" }).then((result) => {
    if (result.state === "denied") {
      console.log("Permission to use accelerometer sensor is denied.");
      return;
    }
    // Use the sensor.
    setInterval(() => {
        getAccel();
    }, 500);
});*/
var gamepad = require("gamepad");


function initGamepad(raAxis, decAxis, onRAChanged, onDecChanged){
    // Initialize the library
    gamepad.init()
    
    // List the state of all currently attached devices
    for (var i = 0, l = gamepad.numDevices(); i < l; i++) {
        console.log(i, gamepad.deviceAtIndex());
    }
    
    // Create a game loop and poll for events
    setInterval(gamepad.processEvents, 16);
    // Scan for new gamepads as a slower rate
    setInterval(gamepad.detectDevices, 500);
    
    // Listen for move events on all gamepads
    gamepad.on("move", function (id, axis, value) {
        
        if(axis == raAxis)
        {            
            onRAChanged(value)
        }
        else if(axis == decAxis)
        {            
            onDecChanged(value)
        }
    });
    
    // // // Listen for button up events on all gamepads
    // // gamepad.on("up", function (id, num) {
    // //     console.log("up", {
    // //     id: id,
    // //     num: num,
    // //     });
    // // });
    
    // // // Listen for button down events on all gamepads
    // // gamepad.on("down", function (id, num) {
    // //     console.log("down", {
    // //     id: id,
    // //     num: num,
    // //     });
    // // });
}

function shutDown(){
    gamepad.shutDown();
}


module.exports.initGamepad = initGamepad;
module.exports.shutDown = shutDown;
 

 
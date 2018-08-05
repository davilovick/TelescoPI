// get a motor-hat instance with the following initialized:
// * a non-default I2C address for the motor hat (default is 0x6F)
// * a stepper with winding one on 'M1' and winding two on 'M2' ports
// * a dc motor on port 'M4'
// * a servo on channel 0
// * a servo on channel 14
let spec = {
    address: 0x60,
    steppers: [{ W1: 'M1', W2: 'M2' }, { W1: 'M3', W2: 'M4' }],
    servos: [0,14]
};
var motorHat = require('motor-hat')(spec);
 
// Since MotorHat 2.0, the instance needs to be initialized.
// This is to enable async initialization, feel free to open an issue if this is a pain.
motorHat.init();


var MotorController = require('./motorController.js')

var motorRA = new MotorController(motorHat.steppers[0], 50);
motorRA.startMotor();
var motorDec = new MotorController(motorHat.steppers[1], 50);
motorDec.startMotor();

console.log(motorRA);



function updateRASpeed(value)
{
    motorRA.updateSpeed(value);
}

function updateDecSpeed(value)
{
    motorDec.updateSpeed(value);
}



var gamepadController = require('./gamepadController.js')

var raAxis = 3;
var decAxis = 4;


gamepadController.initGamepad(raAxis, decAxis, updateRASpeed, updateDecSpeed);
var MotorController = require('./motorController.js')
var GamepadController = require('./gamepadController.js')

// Stepper motors
var motorRA = new MotorController(0, 21 * 8, 21.7);
var motorDec = new MotorController(1, 21 * 8, 0);

motorRA.startMotor();
motorDec.startMotor();


// Gamepad axis
var raAxis = new GamepadController.GamepadAxis(3, false, updateRASpeed);
var decAxis = new GamepadController.GamepadAxis(4, false, updateDecSpeed);

var defaultRASpeed = new GamepadController.GamepadAxis(0, false, updateDefaultRASpeed);

var motorSpeedFactorAxis = new GamepadController.GamepadAxis(5, true, motorSpeedFactor);
var defaultRASpeedFactorAxis = new GamepadController.GamepadAxis(2, true, defaultRASpeedFactor);


var saveTimer;
var restoreTimer;
var flipTimer;

var saveBtn = new GamepadController.GamepadButton(8, 
    () => {
        saveTimer = setTimeout(saveDefaultRASpeed, 2000)
    }, 
    () => 
    {
        clearTimeout(saveTimer);
    });

var restoreBtn = new GamepadController.GamepadButton(6, 
    () => {
        restoreTimer = setTimeout(restoreDefaultRASpeed, 2000)
    }, 
    () => 
    {
        clearTimeout(restoreTimer);
    });

var flipBtn = new GamepadController.GamepadButton(7, 
    () => {
        flipTimer = setTimeout(flipSpinRA, 2000)
    }, 
    () => 
    {
        clearTimeout(flipTimer);
    });

// Modify motor speed using gamepad
var motorFactor = 0;
var defaultRAFactor = 0;

function motorSpeedFactor(value)
{
    motorFactor = value;
}

function defaultRASpeedFactor(value)
{
    defaultRAFactor = value;     
}

function updateRASpeed(value)
{
    motorRA.updateSpeed(value * motorFactor);
}

function updateDecSpeed(value)
{
    motorDec.updateSpeed(value * motorFactor);
}

function updateDefaultRASpeed(value)
{        
    var acceleration = value * defaultRAFactor;
    motorRA.updateDefaultSpeedAcceleration(acceleration);
}

function saveDefaultRASpeed(value)
{
    motorRA.saveDefaultSpeed();
}

function restoreDefaultRASpeed(value)
{
    motorRA.restoreDefaultSpeed();
}

function flipSpinRA(value)
{
    console.log('flip')
    motorRA.flip();
}
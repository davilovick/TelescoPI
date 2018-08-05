let spec = {
    address: 0x60,
    steppers: [{ W1: 'M1', W2: 'M2' }, { W1: 'M3', W2: 'M4' }],
    servos: [0,14]
};
var motorHat = require('motor-hat')(spec);

var fs = require('fs')
 
// Since MotorHat 2.0, the instance needs to be initialized.
// This is to enable async initialization, feel free to open an issue if this is a pain.
motorHat.init();

function Motor(motorId, flipFactor, maxSpeed, defaultSpeed)
{    
    this.speed = 0;
    this.motorId = motorId;
    this.stepper = motorHat.steppers[motorId];    
    this.maxSpeed = maxSpeed;
    this.defaultSpeed = defaultSpeed;   
    this.defaultSpeedAcceleration = 0;
    this.flipFactor = flipFactor;

    this.restoreDefaultSpeed();
}

Motor.prototype.shutdown = function()
{
    clearTimeout(this.motorTimeout);
    this.stepper.releaseSync();
}

Motor.prototype.updateSpeed = function(value)
{
    var absValue = Math.abs(value);    
 
    if(absValue < 0.2)
    {   
        value = 0;        
    }

    this.speed = value * this.maxSpeed;
}

Motor.prototype.updateDefaultSpeedAcceleration = function(value)
{
    if(Math.abs(value) < 0.2)
    {
        value = 0;
    }

    this.defaultSpeedAcceleration = value * 0.05;
}

Motor.prototype.motorStep = function(self)
{
    if(this.defaultSpeedAcceleration != 0)
    {
        self.defaultSpeed += self.defaultSpeedAcceleration;    }

    var finalSpeed = (self.speed + self.defaultSpeed) * this.flipFactor;

    var absSpeed = Math.abs(finalSpeed);    

    if(absSpeed > 0)
    {
        wait = 1 / absSpeed * 1000;

        var dir = finalSpeed > 0 ? "fwd" : "back";
        self.stepper.oneStep(dir, function () {});
    }
    else
    {
        wait = 10
    }

    self.nextStep(wait);
}

Motor.prototype.nextStep = function (wait)
{
    this.motorTimeout = setTimeout(() => { this.motorStep(this) }, wait);   
}


Motor.prototype.startMotor = function ()
{
    this.nextStep(0);
}


Motor.prototype.saveDefaultSpeed = function ()
{
    let value = 
    {
         speed : this.defaultSpeed,
         flipFactor : this.flipFactor
    };
    let data = JSON.stringify(value);

    var fileName = `motor_${this.motorId}.json`;

    console.log('Save', fileName)

    fs.writeFile(fileName, data, (err) =>
    {
        if(err)
        {
            console.log(err);
            return;
        }

        console.log('Save default speed to file', this.defaultSpeed, fileName);
    });
}


Motor.prototype.restoreDefaultSpeed = function ()
{
    var fileName = `motor_${this.motorId}.json`;
    console.log('Trying to Read', fileName)

    fs.readFile(fileName, (err, data) => {
        if(err)
        {
            console.log(err);
            return;
        }
        var json = JSON.parse(data);
        this.defaultSpeed = json.speed;
        this.flipFactor = json.flipFactor
        console.log('Default Speed ', this.defaultSpeed)
        console.log('Flip Factor ', this.flipFactor)
    });
}

Motor.prototype.flip = function ()
{
    this.flipFactor *= -1;
}


module.exports = Motor;
 



function Motor(stepperMotor, maxSpeed)
{    
    this.speed = 30;
    this.sign = 1;
    this.dir = "fwd";
    this.stepper = stepperMotor;
    this.stepper.setSteps(200);    
    this.stepper.setSpeed({rpm:this.speed});
    this.maxSpeed = maxSpeed;
}

Motor.prototype.shutdown = function()
{
    clearTimeout(this.motorTimeout);
    this.stepper.releaseSync();
}

Motor.prototype.updateSpeed = function(value)
{
    var newSign = -Math.sign(value);
    var absValue = Math.abs(value);    

    if(absValue < 0.2)
    {   
        this.speed = 0;        
    }
    else
    {
        this.speed = absValue * this.maxSpeed;
        if(this.sign != newSign)
        {
            if(newSign> 0)
            {
                this.dir = "fwd"
            }
            else{
                this.dir = "back"
            }
        
            this.sign = newSign;        
        }

        this.stepper.setSpeed({rpm:this.speed});
    }
}

Motor.prototype.motorStep = function(self)
{
    var retried = 0;
    var now = void 0;
    var startTime = new Date().getTime();    

    if(self.speed > 0)
    {

        wait = 1 / self.stepper.options.pulsefreq * 1000;

        self.stepper.oneStep(self.dir, function () {});
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

module.exports = Motor;
 
